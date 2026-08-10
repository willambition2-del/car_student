import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlatformUserDto } from './dto/create-platform-user.dto';
import { UpdatePlatformUserDto } from './dto/update-platform-user.dto';
import * as argon2 from 'argon2';
import { getPaginationArgs, buildPaginatedResponse } from '../../common/utils/pagination.util';
import { PaginationQuery } from '../../common/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlatformUsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreatePlatformUserDto) {
    const existing = await this.prisma.platformUser.findUnique({
      where: { email: createUserDto.email }
    });

    if (existing) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    const passwordHash = await argon2.hash(createUserDto.password);

    const user = await this.prisma.platformUser.create({
      data: {
        email: createUserDto.email,
        passwordHash,
        fullName: createUserDto.fullName,
        phone: createUserDto.phone,
        role: createUserDto.role,
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

  async findAll(query: PaginationQuery & { role?: string, search?: string }) {
    const { skip, take, page, limit } = getPaginationArgs(query);
    
    const where: Prisma.PlatformUserWhereInput = {
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
      this.prisma.platformUser.findMany({
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
      this.prisma.platformUser.count({ where })
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.prisma.platformUser.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return user;
  }

  async update(id: string, updateDto: UpdatePlatformUserDto) {
    await this.findOne(id);

    if (updateDto.email) {
      const existing = await this.prisma.platformUser.findFirst({
        where: { email: updateDto.email, id: { not: id } }
      });
      if (existing) {
        throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    const data: any = { ...updateDto };
    if (data.password) {
      data.passwordHash = await argon2.hash(data.password);
      delete data.password;
    }

    return this.prisma.platformUser.update({
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
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.platformUser.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false }
    });

    return { success: true, message: 'تم حذف المستخدم بنجاح' };
  }

  getRoles() {
    return {
      PLATFORM_OWNER: { description: 'مالك المنصة' },
      PLATFORM_ADMIN: { description: 'مدير المنصة' },
      PLATFORM_SUPPORT: { description: 'دعم فني' },
      PLATFORM_ACCOUNTANT: { description: 'محاسب المنصة' },
    };
  }
}
