import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId, deletedAt: null };

    if (search) {
      where.OR = [
        { licenseNumber: { contains: search, mode: 'insensitive' } },
        { nationalId: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { schoolUser: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.driver.findMany({
        where,
        skip,
        take: limit,
        include: {
          buses: { where: { deletedAt: null } },
          schoolUser: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.driver.count({ where }),
    ]);

    return {
      items: items.map((drv) => ({
        id: drv.id,
        fullName: drv.schoolUser?.fullName || 'سائق حافلة',
        licenseNumber: drv.licenseNumber || 'غير مدخل',
        nationalId: drv.nationalId || 'غير مدخل',
        phone: drv.phone || drv.schoolUser?.phone || 'غير مدخل',
        email: drv.schoolUser?.email || 'غير مدخل',
        assignedBusNumber: drv.buses[0]?.busNumber || 'غير معين',
        assignedBusPlate: drv.buses[0]?.plateNumber || 'غير مدخل',
        status: drv.status === 'ACTIVE' ? 'نشط' : 'إجازة',
        appAccessStatus: drv.schoolUser ? 'مُفعّل' : 'غير مُفعّل',
        createdAt: drv.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(schoolId: string, id: string) {
    const driver = await this.prisma.driver.findFirst({
      where: { id, schoolId, deletedAt: null },
      include: {
        buses: { include: { routes: true } },
        schoolUser: true,
        trips: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!driver) {
      throw new NotFoundException('السائق غير موجود');
    }

    return driver;
  }

  async create(
    schoolId: string,
    data: {
      fullName: string;
      password: string;
      phone: string;
      email?: string;
      licenseNumber?: string;
      nationalId?: string;
    },
  ) {
    // Create Driver record
    return this.prisma.driver.create({
      data: {
        schoolId,
        fullName: data.fullName,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        nationalId: data.nationalId,
        status: 'ACTIVE',
      },
    });
  }

  async update(schoolId: string, id: string, data: any) {
    const drv = await this.findOne(schoolId, id);

    if (data.fullName && drv.schoolUserId) {
      await this.prisma.schoolUser.update({
        where: { id: drv.schoolUserId },
        data: { fullName: data.fullName },
      });
    }

    return this.prisma.driver.update({
      where: { id },
      data: {
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        nationalId: data.nationalId,
        status: data.status,
      },
    });
  }
}
