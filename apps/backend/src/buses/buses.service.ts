import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertSchoolOperational } from '../common/utils/tenant-safety.util';

@Injectable()
export class BusesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    schoolId: string,
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId, deletedAt: null };

    if (search) {
      where.OR = [
        { busNumber: { contains: search, mode: 'insensitive' } },
        { plateNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.bus.findMany({
        where,
        skip,
        take: limit,
        include: {
          driver: { include: { schoolUser: true } },
          supervisor: { include: { schoolUser: true } },
          routes: { where: { deletedAt: null } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bus.count({ where }),
    ]);

    return {
      items: items.map((bus) => ({
        id: bus.id,
        busNumber: bus.busNumber,
        plateNumber: bus.plateNumber,
        capacity: bus.capacity,
        model: bus.model || 'مرسيدس سبرينتر',
        year: bus.year || 2024,
        driverName: bus.driver?.fullName || bus.driver?.schoolUser?.fullName || 'غير محدد',
        driverPhone:
          bus.driver?.phone || bus.driver?.schoolUser?.phone || 'غير مدخل',
        supervisorName: bus.supervisor?.schoolUser?.fullName || 'غير معينة',
        supervisorPhone:
          bus.supervisor?.phone ||
          bus.supervisor?.schoolUser?.phone ||
          'غير مدخل',
        routesCount: bus.routes.length,
        status: bus.isActive ? 'نشطة' : 'صيانة',
        createdAt: bus.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(schoolId: string, id: string) {
    const bus = await this.prisma.bus.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        driver: { include: { schoolUser: true } },
        supervisor: { include: { schoolUser: true } },
        routes: { include: { students: { include: { student: true } } } },
        trips: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!bus) {
      throw new NotFoundException('الحافلة غير موجودة');
    }

    return bus;
  }

  async create(
    schoolId: string,
    data: {
      busNumber: string;
      plateNumber: string;
      capacity: number;
      model?: string;
      year?: number;
      driverId?: string;
      supervisorId?: string;
    },
  ) {
    if (
      !Number.isInteger(data.capacity) ||
      data.capacity < 1 ||
      data.capacity > 100
    ) {
      throw new BadRequestException('Bus capacity must be between 1 and 100');
    }
    if (data.driverId) {
      const driver = await this.prisma.driver.findFirst({
        where: { id: data.driverId, schoolId, deletedAt: null },
      });
      if (!driver)
        throw new BadRequestException('Driver does not belong to this school');
    }
    if (data.supervisorId) {
      const supervisor = await this.prisma.supervisor.findFirst({
        where: { id: data.supervisorId, schoolId, deletedAt: null },
      });
      if (!supervisor)
        throw new BadRequestException(
          'Supervisor does not belong to this school',
        );
    }

    const existing = await this.prisma.bus.findFirst({
      where: { schoolId, busNumber: data.busNumber },
    });

    if (existing) {
      throw new BadRequestException('رقم الحافلة مستخدم بالفعل لهذه المدرسة');
    }

    // SaaS Limits Check with Concurrency Protection (Pessimistic Locking)
    return this.prisma.$transaction(async (tx) => {
      // Use Centralized Guard for School Status and Limits
      await assertSchoolOperational(tx, schoolId, { checkMaxBuses: true });

      return tx.bus.create({
        data: {
          schoolId,
          busNumber: data.busNumber,
          plateNumber: data.plateNumber,
          capacity: data.capacity,
          model: data.model,
          year: data.year,
          driverId: data.driverId,
          supervisorId: data.supervisorId,
          isActive: true,
        },
      });
    });
  }

  async update(schoolId: string, id: string, data: any) {
    await this.findOne(schoolId, id);
    if (data.driverId) {
      const driver = await this.prisma.driver.findFirst({
        where: { id: data.driverId, schoolId, deletedAt: null },
      });
      if (!driver)
        throw new BadRequestException('Driver does not belong to this school');
    }
    if (data.supervisorId) {
      const supervisor = await this.prisma.supervisor.findFirst({
        where: { id: data.supervisorId, schoolId, deletedAt: null },
      });
      if (!supervisor)
        throw new BadRequestException(
          'Supervisor does not belong to this school',
        );
    }
    const safeData = {
      busNumber: data.busNumber,
      plateNumber: data.plateNumber,
      capacity: data.capacity,
      model: data.model,
      year: data.year,
      driverId: data.driverId,
      supervisorId: data.supervisorId,
      status: data.status,
      isActive: data.isActive,
      notes: data.notes,
    };

    return this.prisma.bus.update({
      where: { id },
      data: safeData,
    });
  }

  async remove(schoolId: string, id: string) {
    await this.findOne(schoolId, id);
    return this.prisma.bus.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
