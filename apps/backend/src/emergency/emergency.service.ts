import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmergencyService {
  constructor(private prisma: PrismaService) {}

  async findAll(schoolId: string, page = 1, limit = 20, status?: string, actor?: any) {
    const skip = (page - 1) * limit;

    const where: any = {
      trip: {
        schoolId,
        ...(actor?.role === 'SUPERVISOR'
          ? { supervisor: { schoolUserId: actor.id } }
          : {}),
      },
      eventType: { in: ['EMERGENCY', 'EMERGENCY_BREAKDOWN', 'EMERGENCY_ACCIDENT'] },
    };

    if (status && status !== 'ALL') {
      where.newStatus = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.tripEvent.findMany({
        where,
        skip,
        take: limit,
        include: {
          trip: { include: { bus: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tripEvent.count({ where }),
    ]);

    return {
      items: items.map((event) => ({
        id: event.id,
        reportNumber: `EMG-${event.id.slice(-6).toUpperCase()}`,
        busNumber: event.trip?.bus?.busNumber || 'BUS-01',
        busPlate: event.trip?.bus?.plateNumber || 'غير محدد',
        emergencyType: event.eventType === 'EMERGENCY_ACCIDENT' ? 'حادث مروري' : 'عطل ميكانيكي / تأخير طارئ',
        description: event.recordedByName || 'بلاغ طارئ من الميدان',
        latitude: Number(event.latitude || 24.7136),
        longitude: Number(event.longitude || 46.6753),
        status: event.newStatus === 'RESOLVED' ? 'تمت المعالجة' : 'نشط وحرج',
        rawStatus: event.newStatus,
        createdAt: event.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createReport(schoolId: string, data: {
    tripId: string;
    type?: string;
    description: string;
    latitude?: number;
    longitude?: number;
    recordedBy?: string;
  }, actor?: any) {
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: data.tripId,
        schoolId,
        ...(actor?.role === 'SUPERVISOR'
          ? { supervisor: { schoolUserId: actor.id } }
          : {}),
      },
    });

    if (!trip) {
      throw new NotFoundException('الرحلة غير موجودة أو غير مصرح لك بالوصول إليها');
    }

    return this.prisma.tripEvent.create({
      data: {
        tripId: data.tripId,
        eventType: data.type || 'EMERGENCY_BREAKDOWN',
        operationId: `op_emg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        newStatus: 'OPEN',
        latitude: data.latitude || 24.7136,
        longitude: data.longitude || 46.6753,
        recordedBy: actor?.id || data.recordedBy || 'supervisor',
        recordedByName: data.description,
        deviceTimestamp: new Date(),
      },
    });
  }

  async resolveReport(schoolId: string, id: string, notes?: string) {
    const event = await this.prisma.tripEvent.findUnique({
      where: { id },
      include: { trip: true },
    });

    if (!event || event.trip.schoolId !== schoolId) {
      throw new NotFoundException('البلاغ الطارئ غير موجود');
    }

    return this.prisma.tripEvent.update({
      where: { id },
      data: {
        newStatus: 'RESOLVED',
        metadata: { resolutionNotes: notes || 'تم إرسال حافلة بديلة وتأمين سلامة الطلاب بنجاح' },
      },
    });
  }
}
