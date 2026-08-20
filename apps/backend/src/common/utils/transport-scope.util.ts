import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class TransportScopeService {
  static async assertBusSameSchool(
    prisma: PrismaClient,
    schoolId: string,
    busId: string,
  ) {
    const bus = await prisma.bus.findFirst({
      where: { id: busId, schoolId, deletedAt: null },
    });
    if (!bus) {
      throw new NotFoundException('الحافلة غير موجودة أو لا تنتمي لهذه المدرسة');
    }
    return bus;
  }

  static async assertRouteSameSchool(
    prisma: PrismaClient,
    schoolId: string,
    routeId: string,
  ) {
    const route = await prisma.route.findFirst({
      where: { id: routeId, schoolId, deletedAt: null },
    });
    if (!route) {
      throw new NotFoundException('المسار غير موجود أو لا ينتمي لهذه المدرسة');
    }
    return route;
  }

  static async assertSupervisorSameSchool(
    prisma: PrismaClient,
    schoolId: string,
    supervisorId: string,
  ) {
    const supervisor = await prisma.supervisor.findFirst({
      where: { id: supervisorId, schoolId, deletedAt: null },
    });
    if (!supervisor) {
      throw new NotFoundException('المشرف غير موجود أو لا ينتمي لهذه المدرسة');
    }
    return supervisor;
  }

  static async assertDriverSameSchool(
    prisma: PrismaClient,
    schoolId: string,
    driverId: string,
  ) {
    const driver = await prisma.driver.findFirst({
      where: { id: driverId, schoolId, deletedAt: null },
    });
    if (!driver) {
      throw new NotFoundException('السائق غير موجود أو لا ينتمي لهذه المدرسة');
    }
    return driver;
  }

  static async assertStudentSameSchool(
    prisma: PrismaClient,
    schoolId: string,
    studentId: string,
  ) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId, deletedAt: null },
    });
    if (!student) {
      throw new NotFoundException('الطالب غير موجود أو لا ينتمي لهذه المدرسة');
    }
    return student;
  }

  static async assertTripSameSchool(
    prisma: PrismaClient,
    schoolId: string,
    tripId: string,
  ) {
    const trip = await prisma.trip.findFirst({
      where: { id: tripId, schoolId },
    });
    if (!trip) {
      throw new NotFoundException('الرحلة غير موجودة أو لا تنتمي لهذه المدرسة');
    }
    return trip;
  }
}
