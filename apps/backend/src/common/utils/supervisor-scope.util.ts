import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export type SupervisorActor = {
  id: string;
  role: string;
  schoolId: string;
};

export class SupervisorScopeService {
  /**
   * Asserts that a trip belongs to the authenticated supervisor (if role is SUPERVISOR)
   * and belongs to the specified school.
   */
  static async assertTripAccess(
    prisma: PrismaClient,
    schoolId: string,
    tripId: string,
    actor?: { id: string; role: string },
  ) {
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        schoolId,
        ...(actor?.role === 'SUPERVISOR'
          ? { supervisor: { schoolUserId: actor.id } }
          : {}),
      },
      include: {
        bus: true,
        route: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('الرحلة غير موجودة أو غير مصرح لك بالوصول إليها');
    }

    return trip;
  }

  /**
   * Asserts that a student is part of the designated trip roster.
   */
  static async assertStudentInTrip(
    prisma: PrismaClient,
    tripId: string,
    studentId: string,
  ) {
    const tripStudent = await prisma.tripStudent.findFirst({
      where: { tripId, studentId },
      include: { student: true },
    });

    if (!tripStudent) {
      throw new NotFoundException('الطالب غير مدرج بقائمة هذه الرحلة');
    }

    return tripStudent;
  }

  /**
   * Returns the supervisor DB record for a given schoolUser ID.
   */
  static async getSupervisorRecord(
    prisma: PrismaClient,
    schoolId: string,
    schoolUserId: string,
  ) {
    const supervisor = await prisma.supervisor.findFirst({
      where: {
        schoolId,
        schoolUserId,
        deletedAt: null,
      },
      include: {
        buses: true,
      },
    });

    if (!supervisor) {
      throw new ForbiddenException('سجل المشرف غير موجود أو غير مفعل');
    }

    return supervisor;
  }
}
