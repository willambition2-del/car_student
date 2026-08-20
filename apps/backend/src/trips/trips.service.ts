import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudentTripStatus } from '../common/enums';
import { assertSchoolOperational } from '../common/utils/tenant-safety.util';

import { NotificationsService } from '../notifications/notifications.service';
import { TripsGateway } from './trips.gateway';

type TripActor = { id: string; role: string };

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private tripsGateway: TripsGateway,
  ) {}

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
    } else if (actor?.role === 'PARENT') {
      where.tripStudents = {
        some: {
          student: {
            guardianLinks: {
              some: {
                guardian: { schoolUserId: actor.id, isActive: true, deletedAt: null },
              },
            },
          },
        },
      };
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
          include: {
            student: {
              include: {
                locations: true,
                guardianLinks: { include: { guardian: true } },
              },
            },
          },
        },
        tripEvents: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!trip) {
      throw new NotFoundException('الرحلة غير موجودة');
    }

    if (actor?.role === 'PARENT') {
      const isChildInTrip = trip.tripStudents.some((ts) =>
        ts.student?.guardianLinks?.some(
          (gl) => gl.guardian?.schoolUserId === actor.id,
        ),
      );
      if (!isChildInTrip) {
        throw new NotFoundException('الرحلة غير موجودة أو غير مخصصة لك');
      }

      // Privacy: Only return parent's own children
      trip.tripStudents = trip.tripStudents.filter((ts) =>
        ts.student?.guardianLinks?.some(
          (gl) => gl.guardian?.schoolUserId === actor.id,
        ),
      );
    }

    return trip;
  }

  async startTrip(
    schoolId: string,
    data: {
      tripId?: string;
      routeId?: string;
      busId?: string;
      driverId?: string;
      supervisorId?: string;
      tripType?: any;
    },
    actor?: TripActor,
  ) {
    if (data.tripId) {
      // Start an existing scheduled trip
      const trip = await this.findOne(schoolId, data.tripId, actor);
      if (trip.status !== 'SCHEDULED') {
        throw new BadRequestException('Trip is already started or completed');
      }

      return this.prisma.trip.update({
        where: { id: data.tripId },
        data: {
          status: 'STARTED',
          actualStartTime: new Date(),
        },
      });
    }

    if (!data.routeId || !data.busId) {
      throw new BadRequestException('routeId and busId are required for new trips');
    }

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

    if (data.driverId) {
      const driver = await this.prisma.driver.findFirst({
        where: { id: data.driverId, schoolId, deletedAt: null },
      });
      if (!driver) throw new BadRequestException('Driver does not belong to this school');
    }

    if (data.supervisorId) {
      const supervisor = await this.prisma.supervisor.findFirst({
        where: { id: data.supervisorId, schoolId, deletedAt: null },
      });
      if (!supervisor) throw new BadRequestException('Supervisor does not belong to this school');
    }

    const route = await this.prisma.route.findFirst({
      where: { id: data.routeId, schoolId },
      include: { students: true },
    });
    if (!route) throw new NotFoundException('المسار غير موجود');

    return this.prisma.$transaction(async (tx) => {
      await assertSchoolOperational(tx, schoolId);

      // 1. Create Trip record
      const trip = await tx.trip.create({
        data: {
          schoolId,
          routeId: data.routeId!,
          busId: data.busId!,
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
        await tx.tripStudent.createMany({
          data: route.students.map((rs) => ({
            tripId: trip.id,
            studentId: rs.studentId,
            stopOrder: rs.order || 1,
            status: 'WAITING',
          })),
        });
      }

      return trip;
    });
  }

  async updateStudentStatus(
    schoolId: string,
    tripId: string,
    studentId: string,
    status: StudentTripStatus,
    notes?: string,
    actor?: TripActor,
    clientEventId?: string,
  ) {
    const trip = await this.findOne(schoolId, tripId, actor);

    const tripStudent = await this.prisma.tripStudent.findFirst({
      where: { tripId, studentId },
      include: { student: true },
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

    const operationId = clientEventId || `op_online_${Date.now()}_${studentId}_${status}`;

    // 1. Transaction to update TripStudent & create TripEvent
    const updatedTripStudent = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.tripStudent.update({
        where: { id: tripStudent.id },
        data: {
          status,
          boardedAt: status === 'BOARDED' ? new Date() : tripStudent.boardedAt,
          arrivedSchoolAt: status === 'ARRIVED_AT_SCHOOL' ? new Date() : tripStudent.arrivedSchoolAt,
          droppedOffAt: status === 'DROPPED_OFF' ? new Date() : tripStudent.droppedOffAt,
          absentMarkedAt: (status === 'ABSENT' || status === 'EXCUSED_ABSENCE') ? new Date() : tripStudent.absentMarkedAt,
          notes,
        },
      });

      // Create TripEvent
      await tx.tripEvent.create({
        data: {
          operationId,
          tripId,
          studentId,
          eventType: status,
          previousStatus: tripStudent.status,
          newStatus: status,
          recordedBy: actor?.id || 'SYSTEM',
          deviceTimestamp: new Date(),
          source: clientEventId ? 'OFFLINE_SYNC' : 'ONLINE',
          createdAt: new Date(),
        },
      });

      return updated;
    });

    // 2. Map status to Notification specs
    const studentName = tripStudent.student?.fullName || 'الطالب';
    let notifConfig: { type: string; title: string; body: string } | null = null;

    if (status === 'BOARDED') {
      notifConfig = {
        type: 'STUDENT_BOARDED',
        title: 'صعود الطالب',
        body: `صعد ${studentName} إلى الحافلة.`,
      };
    } else if (status === 'ABSENT' || status === 'EXCUSED_ABSENCE') {
      notifConfig = {
        type: 'STUDENT_ABSENT',
        title: 'غياب عن رحلة الحافلة',
        body: `تم تسجيل ${studentName} كغائب عن رحلة الحافلة.`,
      };
    } else if (status === 'ARRIVED_AT_SCHOOL') {
      notifConfig = {
        type: 'STUDENT_ARRIVED_SCHOOL',
        title: 'الوصول إلى المدرسة',
        body: `وصل ${studentName} إلى المدرسة.`,
      };
    } else if (status === 'BOARDED_RETURN') {
      notifConfig = {
        type: 'STUDENT_BOARDED_RETURN',
        title: 'صعود حافلة العودة',
        body: `صعد ${studentName} إلى حافلة العودة.`,
      };
    } else if (status === 'DROPPED_OFF') {
      notifConfig = {
        type: 'STUDENT_DROPPED_OFF',
        title: 'تم إنزال الطالب',
        body: `تم إنزال ${studentName} بنجاح.`,
      };
    } else if (status === 'DELIVERY_FAILED') {
      notifConfig = {
        type: 'DELIVERY_FAILED',
        title: 'تعذر تسليم الطالب',
        body: `تعذر تسليم ${studentName} لعدم وجود مستلم.`,
      };
    }

    // 3. Dispatch Notification to Parents
    if (notifConfig) {
      try {
        const notif = await this.notificationsService.notifyStudentGuardians(schoolId, {
          studentId,
          tripId,
          type: notifConfig.type as any,
          title: notifConfig.title,
          body: notifConfig.body,
          operationId,
          actionType: status,
          metadata: {
            notes,
            supervisorId: trip.supervisorId,
          },
        });

        // 4. Emit via Socket.IO if parents are connected
        if (notif && this.tripsGateway?.server) {
          const recipients = await this.prisma.notificationRecipient.findMany({
            where: { notificationId: notif.id },
          });
          for (const r of recipients) {
            this.tripsGateway.server.to(`user:${r.userId}`).emit('notification', {
              id: notif.id,
              type: notif.type,
              title: notif.title,
              body: notif.body,
              studentId,
              studentName,
              tripId,
              createdAt: notif.createdAt,
            });
          }
        }
      } catch (_) {}
    }

    // 5. Emit real-time status changed to trip room
    try {
      this.tripsGateway.emitTripEvent(tripId, 'student_status_changed', {
        studentId,
        studentName,
        status,
        timestamp: new Date(),
      });
    } catch (_) {}

    return updatedTripStudent;
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

  async syncBatch(schoolId: string, events: any[], actor?: TripActor) {
    const results = {
      accepted: 0,
      rejected: 0,
      duplicates: 0,
      details: [] as any[]
    };

    for (const event of events) {
      try {
        // 1. Idempotency Check
        const existingEvent = await this.prisma.tripEvent.findUnique({
          where: { operationId: event.clientEventId }
        });
        
        if (existingEvent) {
          results.duplicates++;
          results.details.push({ id: event.clientEventId, status: 'DUPLICATE' });
          continue;
        }

        // 2. Validate Trip & School & Supervisor ownership
        const trip = await this.findOne(schoolId, event.tripId, actor);
        if (!trip) {
          results.rejected++;
          results.details.push({ id: event.clientEventId, status: 'REJECTED', reason: 'Trip not found or unauthorized' });
          continue;
        }

        // 3. Process Event via unified updateStudentStatus
        await this.updateStudentStatus(
          schoolId,
          event.tripId,
          event.studentId,
          event.status,
          'Offline Sync',
          actor,
          event.clientEventId
        );

        results.accepted++;
        results.details.push({ id: event.clientEventId, status: 'ACCEPTED' });
      } catch (e: any) {
        results.rejected++;
        results.details.push({ id: event.clientEventId, status: 'REJECTED', reason: e.message });
      }
    }

    return results;
  }
}
