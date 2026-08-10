import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class SupervisorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId, deletedAt: null };

    if (search) {
      where.OR = [
        { nationalId: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { schoolUser: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.supervisor.findMany({
        where,
        skip,
        take: limit,
        include: {
          buses: { where: { deletedAt: null } },
          schoolUser: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.supervisor.count({ where }),
    ]);

    return {
      items: items.map((sup) => ({
        id: sup.id,
        fullName: sup.schoolUser?.fullName || 'مشرفة نقل',
        nationalId: sup.nationalId || 'غير مدخل',
        phone: sup.phone || sup.schoolUser?.phone || 'غير مدخل',
        email: sup.schoolUser?.email || 'غير مدخل',
        assignedBusNumber: sup.buses[0]?.busNumber || 'غير معينة',
        assignedBusPlate: sup.buses[0]?.plateNumber || 'غير مدخل',
        status: sup.status === 'ACTIVE' ? 'نشطة' : 'إجازة',
        appAccessStatus: sup.schoolUser ? 'مُفعّل' : 'غير مُفعّل',
        createdAt: sup.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(schoolId: string, id: string) {
    const supervisor = await this.prisma.supervisor.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        buses: { include: { routes: true } },
        schoolUser: true,
        trips: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!supervisor) {
      throw new NotFoundException('المشرفة غير موجودة');
    }

    return supervisor;
  }

  async create(
    schoolId: string,
    data: {
      fullName: string;
      password: string;
      phone: string;
      email?: string;
      nationalId?: string;
    },
  ) {
    if (!data.password || data.password.length < 12) {
      throw new BadRequestException(
        'Supervisor initial password must contain at least 12 characters',
      );
    }
    const passwordHash = await argon2.hash(data.password);

    // 1. Create SchoolUser account for Supervisor app access
    const user = await this.prisma.schoolUser.create({
      data: {
        schoolId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || `sup_${Date.now()}@school.local`,
        passwordHash,
        role: 'SUPERVISOR',
      },
    });

    // 2. Create Supervisor record linked to SchoolUser
    return this.prisma.supervisor.create({
      data: {
        schoolId,
        schoolUserId: user.id,
        phone: data.phone,
        nationalId: data.nationalId,
        status: 'ACTIVE',
      },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const sup = await this.findOne(schoolId, id);

    if (data.fullName && sup.schoolUserId) {
      await this.prisma.schoolUser.update({
        where: { id: sup.schoolUserId },
        data: { fullName: data.fullName },
      });
    }

    return this.prisma.supervisor.update({
      where: { id },
      data: {
        phone: data.phone,
        nationalId: data.nationalId,
        status: data.status,
      },
    });
  }
}
