import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuardiansService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId, deletedAt: null };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.guardian.findMany({
        where,
        skip,
        take: limit,
        include: {
          studentLinks: { include: { student: true } },
          schoolUser: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.guardian.count({ where }),
    ]);

    return {
      items: items.map((guardian) => ({
        id: guardian.id,
        fullName: guardian.fullName,
        nationalId: guardian.nationalId || 'غير مدخل',
        phone: guardian.phone,
        email: guardian.email || 'غير مدخل',
        relation: guardian.relation || 'أب',
        studentsCount: guardian.studentLinks.length,
        studentsNames: guardian.studentLinks.map((sl) => sl.student.fullName).join('، '),
        appAccessStatus: guardian.schoolUser ? 'مُفعّل' : 'غير مُفعّل',
        createdAt: guardian.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(schoolId: string, id: string) {
    const guardian = await this.prisma.guardian.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        studentLinks: { include: { student: { include: { locations: true, routeStudents: { include: { route: true } } } } } },
        schoolUser: true,
      },
    });

    if (!guardian) {
      throw new NotFoundException('ولي الأمر غير موجود');
    }

    return guardian;
  }

  async create(schoolId: string, data: {
    fullName: string;
    phone: string;
    nationalId?: string;
    email?: string;
    relationship?: string;
  }) {
    return this.prisma.guardian.create({
      data: {
        schoolId,
        fullName: data.fullName,
        phone: data.phone,
        nationalId: data.nationalId,
        email: data.email,
        relation: data.relationship || 'أب',
      },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    await this.findOne(schoolId, id);
    return this.prisma.guardian.update({
      where: { id },
      data,
    });
  }
}
