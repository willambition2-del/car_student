import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    schoolId: string,
    page = 1,
    limit = 20,
    search?: string,
    tripType?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId, deletedAt: null };

    if (tripType) {
      where.tripType = tripType;
    }

    if (search) {
      where.OR = [
        { nameAr: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.route.findMany({
        where,
        skip,
        take: limit,
        include: {
          bus: {
            include: {
              driver: { include: { schoolUser: true } },
              supervisor: { include: { schoolUser: true } },
            },
          },
          stops: { include: { stop: true }, orderBy: { order: 'asc' } },
          students: { include: { student: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.route.count({ where }),
    ]);

    return {
      items: items.map((route) => ({
        id: route.id,
        nameAr: route.nameAr,
        nameEn: route.nameEn,
        busNumber: route.bus?.busNumber || 'غير موزع',
        driverName: route.bus?.driver?.schoolUser?.fullName || 'غير معين',
        supervisorName:
          route.bus?.supervisor?.schoolUser?.fullName || 'غير معينة',
        tripType: route.tripType === 'MORNING' ? 'صباحي' : 'عودة',
        stopsCount: route.stops.length,
        studentsCount: route.students.length,
        estimatedDurationMinutes: route.estimatedDuration || 35,
        distanceKm: Number(route.distanceKm || 12.5),
        status: route.isActive ? 'نشط' : 'معطل',
        createdAt: route.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(schoolId: string, id: string) {
    const route = await this.prisma.route.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        bus: {
          include: {
            driver: { include: { schoolUser: true } },
            supervisor: { include: { schoolUser: true } },
          },
        },
        stops: { include: { stop: true }, orderBy: { order: 'asc' } },
        students: { include: { student: { include: { locations: true } } } },
        trips: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!route) {
      throw new NotFoundException('المسار غير موجود');
    }

    return route;
  }

  async create(
    schoolId: string,
    data: {
      nameAr: string;
      nameEn?: string;
      description?: string;
      busId?: string;
      tripType?: any;
      estimatedDuration?: number;
      distanceKm?: number;
      polyline?: string;
    },
  ) {
    if (data.busId) {
      const bus = await this.prisma.bus.findFirst({
        where: { id: data.busId, schoolId, deletedAt: null },
      });
      if (!bus)
        throw new BadRequestException('Bus does not belong to this school');
    }

    return this.prisma.route.create({
      data: {
        schoolId,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description,
        busId: data.busId,
        tripType: data.tripType || 'MORNING',
        estimatedDuration: data.estimatedDuration,
        distanceKm: data.distanceKm,
        polyline: data.polyline,
        isActive: true,
      },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    await this.findOne(schoolId, id);
    if (data.busId) {
      const bus = await this.prisma.bus.findFirst({
        where: { id: data.busId, schoolId, deletedAt: null },
      });
      if (!bus)
        throw new BadRequestException('Bus does not belong to this school');
    }
    const safeData = {
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      description: data.description,
      busId: data.busId,
      tripType: data.tripType,
      estimatedDuration: data.estimatedDuration,
      distanceKm: data.distanceKm,
      polyline: data.polyline,
      isActive: data.isActive,
    };
    return this.prisma.route.update({
      where: { id },
      data: safeData,
    });
  }

  async assignStudent(
    schoolId: string,
    routeId: string,
    studentId: string,
    stopId?: string,
  ) {
    await this.findOne(schoolId, routeId);

    const student = await this.prisma.student.findFirst({
      where: { id: studentId, schoolId, deletedAt: null },
    });
    if (!student)
      throw new BadRequestException('Student does not belong to this school');

    if (stopId) {
      const routeStop = await this.prisma.routeStop.findFirst({
        where: { routeId, stopId, stop: { schoolId } },
      });
      if (!routeStop) {
        throw new BadRequestException(
          'Stop is not part of this route and school',
        );
      }
    }

    const existing = await this.prisma.routeStudent.findFirst({
      where: { routeId, studentId },
    });

    if (existing) {
      throw new BadRequestException('الطالب مخصص مسبقاً بهذا المسار');
    }

    return this.prisma.routeStudent.create({
      data: {
        routeId,
        studentId,
        stopId,
      },
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    return this.prisma.route.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
