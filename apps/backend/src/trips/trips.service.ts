import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentTripStatus } from '../common/enums';

type TripActor = { id: string; role: string };

@Injectable()
export class TripsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    schoolId: string,
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
    date?: string,
    actor?: TripActor,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };
    if (actor?.role === 'SUPERVISOR') {
      where.supervisor = { schoolUserId: actor.id };
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      where.tripDate = startDate;
    }

    const [items, total] = await Promise.all([
      this.prisma.trip.findMany({
        where,
        skip,
        take: limit,
        include: {
          bus: true,
          route: true,
          driver: { include: { schoolUser: true } },
          supervisor: { include: { schoolUser: true } },
          tripStudents: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trip.count({ where }),
    ]);

    return {
      items: items.map((trip) => {
        const totalStudents = trip.tripStudents.length;
        const boardedCount = trip.tripStudents.filter(
          (ts) => ts.status === 'BOARDED' || ts.status === 'DROPPED_OFF',
        ).length;
        const absentCount = trip.tripStudents.filter(
          (ts) => ts.status === 'ABSENT' || ts.status === 'EXCUSED_ABSENCE',
        ).length;

        return {
          id: trip.id,
          tripNumber: `TRIP-${trip.id.slice(-6).toUpperCase()}`,
          routeName: trip.route?.nameAr || 'مسار النقل الميداني',
          busNumber: trip.bus?.busNumber || 'غير محدد',
          busPlate: trip.bus?.plateNumber || 'غير محدد',
          driverName: trip.driver?.fullName || trip.driver?.schoolUser?.fullName || 'غير مرتبط',
          supervisorName:
            trip.supervisor?.schoolUser?.fullName || 'مشرفة التجربة',
          tripType: trip.tripType === 'MORNING' ? 'صباحي' : 'عودة',
          status:
            trip.status === 'STARTED'
              ? 'قيد التنفيذ'
              : trip.status === 'COMPLETED'
                ? 'مكتملة'
                : trip.status === 'SCHEDULED'
                  ? 'مجدولة'
                  : trip.status,
          rawStatus: trip.status,
          totalStudents,
          boardedCount,
          absentCount,
          startedAt: trip.actualStartTime || trip.createdAt,
          completedAt: trip.actualEndTime,
          createdAt: trip.createdAt,
        };
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(schoolId: string, id: string, actor?: TripActor) {
    const trip = await this.prisma.trip.findFirst({
      where: {
        id,
        schoolId,
        ...(actor?.role === 'SUPERVISOR'
          ? { supervisor: { schoolUserId: actor.id } }
          : {}),
      },
      include: {
        bus: true,
        route: { include: { stops: { include: { stop: true } } } },
        driver: { include: { schoolUser: true } },
        supervisor: { include: { schoolUser: true } },
        tripStudents: {
          include: { student: { include: { locations: true } } },
        },
        tripEvents: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!trip) {
      throw new NotFoundException('الرحلة غير موجودة');
    }

    return trip;
  }

  async startTrip(
    schoolId: string,
    data: {
      routeId: string;
      busId: string;
      driverId?: string;
      supervisorId?: string;
      tripType?: any;
    },
    actor?: TripActor,
  ) {
    const bus = await this.prisma.bus.findFirst({
      where: { id: data.busId, schoolId },
    });
    if (!bus) throw new NotFoundException('الحافلة غير موجودة');

    if (actor?.role === 'SUPERVISOR') {
      const supervisor = await this.prisma.supervisor.findFirst({
        where: { schoolId, schoolUserId: actor.id, deletedAt: null },
      });
      const assignedSupervisorId = data.supervisorId || bus.supervisorId;
      if (!supervisor || assignedSupervisorId !== supervisor.id) {
        throw new BadRequestException('Supervisor is not assigned to this bus');
      }
    }

    const route = await this.prisma.route.findFirst({
      where: { id: data.routeId, schoolId },
      include: { students: true },
    });
    if (!route) throw new NotFoundException('المسار غير موجود');

    // 1. Create Trip record
    const trip = await this.prisma.trip.create({
      data: {
        schoolId,
        routeId: data.routeId,
        busId: data.busId,
        driverId: data.driverId || bus.driverId,
        supervisorId: data.supervisorId || bus.supervisorId,
        tripType: data.tripType || route.tripType,
        status: 'STARTED',
        tripDate: new Date(),
        actualStartTime: new Date(),
      },
    });

    // 2. Populate Trip Students roster from Route
    if (route.students.length > 0) {
      await this.prisma.tripStudent.createMany({
        data: route.students.map((rs) => ({
          tripId: trip.id,
          studentId: rs.studentId,
          stopOrder: rs.order || 1,
          status: 'WAITING',
        })),
      });
    }

    return trip;
  }

  async updateStudentStatus(
    schoolId: string,
    tripId: string,
    studentId: string,
    status: StudentTripStatus,
    notes?: string,
    actor?: TripActor,
  ) {
    const trip = await this.findOne(schoolId, tripId, actor);

    const tripStudent = await this.prisma.tripStudent.findFirst({
      where: { tripId, studentId },
    });

    if (!tripStudent) {
      throw new NotFoundException('الطالب غير مدرج بقائمة الرحلة');
    }

    if (trip.status !== 'STARTED') {
      throw new BadRequestException(
        'Student status can only change during an active trip',
      );
    }
    if (tripStudent.status === status) return tripStudent;

    const allowedTransitions: Record<string, readonly string[]> = {
      WAITING: ['BOARDED', 'ABSENT', 'EXCUSED_ABSENCE'],
      BOARDED: ['ARRIVED_AT_SCHOOL', 'DROPPED_OFF'],
      ARRIVED_AT_SCHOOL: ['BOARDED_RETURN'],
      BOARDED_RETURN: ['DROPPED_OFF', 'DELIVERY_FAILED'],
      ON_BUS: ['DROPPED_OFF', 'DELIVERY_FAILED'],
    };
    if (!allowedTransitions[tripStudent.status]?.includes(status)) {
      throw new BadRequestException('Invalid student trip status transition');
    }

    return this.prisma.tripStudent.update({
      where: { id: tripStudent.id },
      data: {
        status,
        boardedAt: status === 'BOARDED' ? new Date() : tripStudent.boardedAt,
        droppedOffAt:
          status === 'DROPPED_OFF' ? new Date() : tripStudent.droppedOffAt,
        notes,
      },
    });
  }

  async completeTrip(schoolId: string, id: string, actor?: TripActor) {
    const trip = await this.findOne(schoolId, id, actor);
    if (trip.status === 'COMPLETED') return trip;
    if (trip.status !== 'STARTED' && trip.status !== 'ARRIVED_AT_SCHOOL') {
      throw new BadRequestException('Invalid trip completion transition');
    }
    const unresolvedStudents = await this.prisma.tripStudent.count({
      where: {
        tripId: id,
        status: { in: ['WAITING', 'BOARDED', 'BOARDED_RETURN', 'ON_BUS'] },
      },
    });
    if (unresolvedStudents > 0) {
      throw new BadRequestException('Trip has students with unresolved status');
    }

    return this.prisma.trip.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        actualEndTime: new Date(),
      },
    });
  }
}
