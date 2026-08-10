import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from 'argon2';
import { getPaginationArgs, buildPaginatedResponse } from '../../common/utils/pagination.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlatformSchoolsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { skip, take, page, limit } = getPaginationArgs(query);
    const where: Prisma.SchoolWhereInput = { deletedAt: null };
    
    if (query.status) where.status = query.status as any;
    if (query.search) {
      where.OR = [
        { nameAr: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.school.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.school.count({ where })
    ]);
    return buildPaginatedResponse(items, total, page, limit);
  }

  async create(dto: any, currentUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create School
      const school = await tx.school.create({
        data: {
          nameAr: dto.nameAr,
          slug: dto.slug,
          status: 'ACTIVE',
          createdBy: currentUserId
        }
      });

      // 2. Generate secure temp password
      const crypto = require('crypto');
      const tempPassword = crypto.randomBytes(8).toString('hex');
      const passwordHash = await argon2.hash(tempPassword);

      // 3. Create Admin
      await tx.schoolUser.create({
        data: {
          schoolId: school.id,
          email: dto.adminEmail,
          passwordHash,
          fullName: dto.adminName,
          role: 'SCHOOL_ADMIN',
          mustChangePassword: true
        }
      });

      // 4. Create Subscription
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      await tx.subscription.create({
        data: {
          schoolId: school.id,
          planId: dto.planId,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate
        }
      });

      // 5. Create Settings
      await tx.schoolSetting.create({
        data: { schoolId: school.id, key: 'timezone', value: 'Asia/Riyadh' }
      });

      // 6. Audit Log
      await tx.auditLog.create({
        data: {
          action: 'CREATE',
          entityType: 'School',
          entityId: school.id,
          userId: currentUserId,
          userType: 'platform',
          metadata: { planId: dto.planId }
        }
      });

      // In a real app we'd send the tempPassword via email here
      console.log(`[Provision] Temp password for ${dto.adminEmail}: ${tempPassword}`);

      return { ...school, tempPassword };
    });
  }

  async findOne(id: string) {
    const school = await this.prisma.school.findUnique({ where: { id }, include: { subscriptions: true } });
    if (!school) throw new NotFoundException();
    return school;
  }

  async update(id: string, data: any) {
    return this.prisma.school.update({ where: { id }, data });
  }

  async suspend(id: string) {
    return this.prisma.school.update({ where: { id }, data: { status: 'SUSPENDED', suspendedAt: new Date() } });
  }

  async activate(id: string) {
    return this.prisma.school.update({ where: { id }, data: { status: 'ACTIVE', suspendedAt: null } });
  }

  async createSupportSession(schoolId: string, adminId: string) {
    // Generate a temporary token or session for support access
    return { success: true, url: `/support-login?token=temp_generated_token&school=${schoolId}` };
  }
}
