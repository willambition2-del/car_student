import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { getPaginationArgs, buildPaginatedResponse } from '../common/utils/pagination.util';
import { PaginationQuery } from '../common/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(schoolId: string, createUserDto: CreateUserDto, currentUserId: string) {
    const existing = await this.prisma.schoolUser.findFirst({
      where: { schoolId, email: createUserDto.email }
    });

    if (existing) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل في هذه المدرسة');
    }

    const passwordHash = await argon2.hash(createUserDto.password);

    const user = await this.prisma.schoolUser.create({
      data: {
        schoolId,
        email: createUserDto.email,
        passwordHash,
        fullName: createUserDto.fullName,
        phone: createUserDto.phone,
        nationalId: createUserDto.nationalId,
        role: createUserDto.role,
        createdBy: currentUserId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    return user;
  }

  async findAll(schoolId: string, query: PaginationQuery & { role?: string, search?: string }) {
    const { skip, take, page, limit } = getPaginationArgs(query);
    
    const where: Prisma.SchoolUserWhereInput = {
      schoolId,
      deletedAt: null,
    };

    if (query.role) {
      where.role = query.role as any;
    }

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.schoolUser.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          phone: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.schoolUser.count({ where })
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(schoolId: string, id: string) {
    const user = await this.prisma.schoolUser.findFirst({
      where: { id, schoolId, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        nationalId: true,
        isActive: true,
        createdAt: true,
        permissions: true,
      }
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return user;
  }

  async update(schoolId: string, id: string, updateUserDto: UpdateUserDto) {
    // Verify existence & school isolation
    await this.findOne(schoolId, id);

    if (updateUserDto.email) {
      const existing = await this.prisma.schoolUser.findFirst({
        where: { schoolId, email: updateUserDto.email, id: { not: id } }
      });
      if (existing) {
        throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    const data: any = { ...updateUserDto };
    if (data.password) {
      data.passwordHash = await argon2.hash(data.password);
      delete data.password;
    }
    if (data.permissions !== undefined) {
      // Simplification: updating permissions. Actually it's a separate model in DB (`SchoolUserPermission`)
      // But let's assume we manage it through standard relation updates or ignore for this snippet.
      // Wait, let's remove it from `data` since it needs separate processing.
      delete data.permissions;
    }

    const user = await this.prisma.schoolUser.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      }
    });

    // Handle permissions if provided
    if (updateUserDto.permissions) {
      // Clear existing
      await this.prisma.schoolUserPermission.deleteMany({
        where: { schoolUserId: id }
      });
      
      // Add new
      if (updateUserDto.permissions.length > 0) {
        await this.prisma.schoolUserPermission.createMany({
          data: updateUserDto.permissions.map(p => ({
            schoolUserId: id,
            permission: p,
          }))
        });
      }
    }

    return user;
  }

  async remove(schoolId: string, id: string) {
    // Verify existence & school isolation
    await this.findOne(schoolId, id);

    await this.prisma.schoolUser.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });

    return { success: true, message: 'تم حذف المستخدم بنجاح' };
  }

  getRoles() {
    return {
      SCHOOL_OWNER: { description: 'مالك المدرسة', defaultPermissions: ['ALL'] },
      SCHOOL_ADMIN: { description: 'مدير المدرسة', defaultPermissions: ['MANAGE_USERS', 'MANAGE_STUDENTS'] },
      TRANSPORT_MANAGER: { description: 'مدير النقل', defaultPermissions: ['MANAGE_ROUTES', 'MANAGE_BUSES'] },
      ACCOUNTANT: { description: 'محاسب', defaultPermissions: ['MANAGE_FINANCE'] },
      SUPERVISOR: { description: 'مشرف/ة', defaultPermissions: ['VIEW_TRIPS'] },
      DRIVER: { description: 'سائق', defaultPermissions: ['VIEW_TRIPS'] },
      PARENT: { description: 'ولي أمر', defaultPermissions: ['VIEW_STUDENT_TRIPS'] },
      DATA_ENTRY: { description: 'مدخل بيانات', defaultPermissions: ['MANAGE_STUDENTS'] },
    };
  }
}
