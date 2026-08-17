import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertSchoolOperational } from '../common/utils/tenant-safety.util';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, page = 1, limit = 20, search?: string, grade?: string) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId, deletedAt: null };

    if (grade) where.grade = grade;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { schoolNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          guardianLinks: { include: { guardian: true } },
          routeStudents: { include: { route: { include: { bus: true } } } },
          locations: { where: { isPrimary: true, isActive: true }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      items: items.map((student) => {
        const primaryGuardian = student.guardianLinks.find((g) => g.isPrimary)?.guardian || student.guardianLinks[0]?.guardian;
        const currentRoute = student.routeStudents[0]?.route;
        const currentLocation = student.locations[0];

        return {
          id: student.id,
          schoolNumber: student.schoolNumber,
          fullName: student.fullName,
          gender: student.gender,
          grade: student.grade,
          classSection: student.classSection,
          guardianName: primaryGuardian?.fullName || 'غير محدد',
          guardianPhone: primaryGuardian?.phone || 'غير محدد',
          busNumber: currentRoute?.bus?.busNumber || 'غير موزع',
          routeName: currentRoute?.nameAr || 'غير موزع',
          neighborhood: currentLocation?.regionName || currentLocation?.addressDescription || 'غير محدد',
          status: student.isActive ? 'نشط' : 'معطل',
          createdAt: student.createdAt,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(schoolId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        guardianLinks: { include: { guardian: true } },
        locations: { where: { isActive: true } },
        routeStudents: { include: { route: { include: { bus: { include: { driver: { include: { schoolUser: true } }, supervisor: { include: { schoolUser: true } } } } } } } },
        tripStudents: { include: { trip: true }, orderBy: { createdAt: 'desc' }, take: 10 },
        absenceRequests: { orderBy: { createdAt: 'desc' }, take: 5 },
        fees: true,
      },
    });

    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }

    return student;
  }

  async create(schoolId: string, data: {
    schoolNumber: string;
    fullName: string;
    gender?: any;
    grade?: string;
    classSection?: string;
    medicalNotes?: string;
    guardianId?: string;
  }) {
    const existing = await this.prisma.student.findFirst({
      where: { schoolId, schoolNumber: data.schoolNumber },
    });

    if (existing) {
      throw new BadRequestException('رقم الطالب المدرسي مستخدم بالفعل بهذه المدرسة');
    }

    // SaaS Limits Check with Concurrency Protection (Pessimistic Locking)
    return this.prisma.$transaction(async (tx) => {
      // Use Centralized Guard for School Status and Limits
      await assertSchoolOperational(tx, schoolId, { checkMaxStudents: true });

      const student = await tx.student.create({
        data: {
          schoolId,
          schoolNumber: data.schoolNumber,
          fullName: data.fullName,
          gender: data.gender,
          grade: data.grade,
          classSection: data.classSection,
          medicalNotes: data.medicalNotes,
        },
      });

      if (data.guardianId) {
        await tx.studentGuardian.create({
          data: {
            studentId: student.id,
            guardianId: data.guardianId,
            isPrimary: true,
          },
        });
      }

      return student;
    });
  }

  async update(schoolId: string, id: string, data: any) {
    await this.findOne(schoolId, id);
    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    return this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
