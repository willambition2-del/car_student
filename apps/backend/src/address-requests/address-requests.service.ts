import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressRequestsService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, page = 1, limit = 20, status?: string, actor?: any) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };

    if (actor?.role === 'PARENT') {
      where.student = {
        guardianLinks: {
          some: {
            guardian: { schoolUserId: actor.id, isActive: true, deletedAt: null },
          },
        },
      };
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.addressChangeRequest.findMany({
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
      this.prisma.addressChangeRequest.count({ where }),
    ]);

    return {
      items: items.map((req) => {
        const primaryGuardian = req.student?.guardianLinks[0]?.guardian;

        return {
          id: req.id,
          requestNumber: `REQ-${req.id.slice(-6).toUpperCase()}`,
          studentName: req.student?.fullName || 'غير محدد',
          guardianName: primaryGuardian?.fullName || 'غير محدد',
          guardianPhone: primaryGuardian?.phone || 'غير محدد',
          oldAddress: 'موقع السكن الحالي',
          newAddress: req.newAddress || 'موقع السكن الجديد',
          newLatitude: Number(req.newLatitude),
          newLongitude: Number(req.newLongitude),
          status:
            req.status === 'NEW'
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

  async findOne(schoolId: string, id: string, actor?: any) {
    const req = await this.prisma.addressChangeRequest.findFirst({
      where: {
        id,
        schoolId,
        ...(actor?.role === 'PARENT'
          ? {
              student: {
                guardianLinks: {
                  some: {
                    guardian: {
                      schoolUserId: actor.id,
                      isActive: true,
                      deletedAt: null,
                    },
                  },
                },
              },
            }
          : {}),
      },
      include: {
        student: {
          include: {
            locations: true,
            guardianLinks: { include: { guardian: true } },
          },
        },
      },
    });

    if (!req) {
      throw new NotFoundException('طلب تغيير العنوان غير موجود أو غير مخصص لك');
    }

    return req;
  }

  async create(
    schoolId: string,
    data: {
      studentId: string;
      guardianId?: string;
      newLatitude: number;
      newLongitude: number;
      newAddress?: string;
      notes?: string;
    },
    actor?: any,
  ) {
    if (
      !Number.isFinite(data.newLatitude) ||
      data.newLatitude < -90 ||
      data.newLatitude > 90 ||
      !Number.isFinite(data.newLongitude) ||
      data.newLongitude < -180 ||
      data.newLongitude > 180
    ) {
      throw new BadRequestException('Invalid coordinates');
    }

    let guardianId = data.guardianId;

    if (actor?.role === 'PARENT') {
      const guardian = await this.prisma.guardian.findFirst({
        where: { schoolId, schoolUserId: actor.id, isActive: true, deletedAt: null },
      });
      if (!guardian) {
        throw new BadRequestException('سجل ولي الأمر غير موجود أو غير مفعل');
      }
      guardianId = guardian.id;
    }

    if (!guardianId) {
      throw new BadRequestException('guardianId is required');
    }

    const guardianLink = await this.prisma.studentGuardian.findFirst({
      where: {
        studentId: data.studentId,
        guardianId,
        student: { schoolId, deletedAt: null },
        guardian: { schoolId, deletedAt: null },
      },
    });
    if (!guardianLink)
      throw new BadRequestException(
        'Guardian is not authorized for this student',
      );

    return this.prisma.addressChangeRequest.create({
      data: {
        schoolId,
        studentId: data.studentId,
        requestedBy: guardianId,
        newLatitude: data.newLatitude,
        newLongitude: data.newLongitude,
        newAddress: data.newAddress,
        reason: data.notes,
        status: 'NEW',
      },
    });
  }

  async approve(schoolId: string, id: string, notes?: string) {
    const req = await this.findOne(schoolId, id);

    if (req.status !== 'NEW' && req.status !== 'UNDER_REVIEW') {
      throw new BadRequestException('الطلب مقطوع القرار بالفعل');
    }

    // 1. Deactivate old locations for student
    await this.prisma.studentLocation.updateMany({
      where: { studentId: req.studentId },
      data: { isPrimary: false, isActive: false },
    });

    // 2. Create new primary location
    await this.prisma.studentLocation.create({
      data: {
        studentId: req.studentId,
        locationType: 'HOME',
        addressDescription: req.newAddress || 'العنوان المعتمد حديثاً',
        latitude: req.newLatitude,
        longitude: req.newLongitude,
        isPrimary: true,
        isActive: true,
      },
    });

    // 3. Update request status
    return this.prisma.addressChangeRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewNotes: notes || 'تمت الموافقة وتحديث الموقع السكني للطالب بنجاح',
        reviewedAt: new Date(),
      },
    });
  }

  async reject(schoolId: string, id: string, reason: string) {
    await this.findOne(schoolId, id);

    return this.prisma.addressChangeRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewNotes: reason || 'تم الرفض لعدم تغطية المنطقة السكنية',
        reviewedAt: new Date(),
      },
    });
  }
}
