import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AbsenceRequestsService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.absenceRequest.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            include: {
              guardianLinks: { include: { guardian: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.absenceRequest.count({ where }),
    ]);

    return {
      items: items.map((req) => {
        const primaryGuardian = req.student?.guardianLinks[0]?.guardian;

        return {
          id: req.id,
          requestNumber: `ABS-${req.id.slice(-6).toUpperCase()}`,
          studentName: req.student?.fullName || 'غير محدد',
          guardianName: primaryGuardian?.fullName || 'غير محدد',
          guardianPhone: primaryGuardian?.phone || 'غير محدد',
          absenceType:
            req.absenceType === 'FULL_DAY'
              ? 'يوم كامل'
              : req.absenceType === 'MORNING_ONLY'
                ? 'صباحي فقط'
                : 'عودة فقط',
          startDate: req.startDate,
          endDate: req.endDate,
          reason: req.reason || 'ظرف عائلي',
          status:
            req.status === 'NEW' || req.status === 'PENDING'
              ? 'جديد'
              : req.status === 'APPROVED'
                ? 'مقبول'
                : req.status === 'REJECTED'
                  ? 'مرفوض'
                  : req.status,
          rawStatus: req.status,
          createdAt: req.createdAt,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(schoolId: string, id: string) {
    const req = await this.prisma.absenceRequest.findFirst({
      where: { id, schoolId },
      include: {
        student: {
          include: {
            guardianLinks: { include: { guardian: true } },
          },
        },
      },
    });

    if (!req) {
      throw new NotFoundException('طلب الغياب غير موجود');
    }

    return req;
  }

  async create(
    schoolId: string,
    data: {
      studentId: string;
      guardianId: string;
      startDate: Date;
      endDate: Date;
      absenceType?: any;
      reason?: string;
    },
  ) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      endDate < startDate
    ) {
      throw new BadRequestException('Invalid absence date range');
    }
    const guardianLink = await this.prisma.studentGuardian.findFirst({
      where: {
        studentId: data.studentId,
        guardianId: data.guardianId,
        student: { schoolId, deletedAt: null },
        guardian: { schoolId, deletedAt: null },
      },
    });
    if (!guardianLink)
      throw new BadRequestException(
        'Guardian is not authorized for this student',
      );

    return this.prisma.absenceRequest.create({
      data: {
        schoolId,
        studentId: data.studentId,
        requestedBy: data.guardianId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        absenceType: data.absenceType || 'FULL_DAY',
        reason: data.reason,
        status: 'PENDING',
      },
    });
  }

  async approve(schoolId: string, id: string, notes?: string) {
    const req = await this.findOne(schoolId, id);

    if (
      req.status !== 'NEW' &&
      req.status !== 'PENDING' &&
      req.status !== 'UNDER_REVIEW'
    ) {
      throw new BadRequestException('الطلب تم البت فيه مسبقاً');
    }

    return this.prisma.absenceRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        notes: notes || 'تمت الموافقة والإشعار لقائمة الرحلة',
        approvedAt: new Date(),
      },
    });
  }

  async reject(schoolId: string, id: string, reason: string) {
    await this.findOne(schoolId, id);

    return this.prisma.absenceRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || 'مرفوض لعدم استيفاء المدة المتاحة',
        approvedAt: new Date(),
      },
    });
  }
}
