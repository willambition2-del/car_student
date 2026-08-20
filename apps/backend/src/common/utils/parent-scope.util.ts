import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class ParentScopeService {
  /**
   * Resolves the Guardian record associated with the authenticated SchoolUser.
   */
  static async getAuthenticatedGuardian(
    prisma: PrismaClient,
    schoolId: string,
    schoolUserId: string,
  ) {
    const guardian = await prisma.guardian.findFirst({
      where: {
        schoolId,
        schoolUserId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!guardian) {
      throw new ForbiddenException('سجل ولي الأمر غير موجود أو غير مفعل');
    }

    return guardian;
  }

  /**
   * Asserts that a student is linked to the authenticated guardian/parent.
   */
  static async assertOwnChild(
    prisma: PrismaClient,
    schoolId: string,
    studentId: string,
    schoolUserId: string,
  ) {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        schoolId,
        deletedAt: null,
        guardianLinks: {
          some: {
            guardian: {
              schoolUserId,
              isActive: true,
              deletedAt: null,
            },
          },
        },
      },
      include: {
        locations: { where: { isActive: true } },
        routeStudents: { include: { route: true } },
      },
    });

    if (!student) {
      throw new NotFoundException('الطالب غير موجود أو غير مسجل في حسابك');
    }

    return student;
  }

  /**
   * Returns all students linked to the authenticated parent.
   */
  static async getOwnChildren(
    prisma: PrismaClient,
    schoolId: string,
    schoolUserId: string,
  ) {
    return prisma.student.findMany({
      where: {
        schoolId,
        deletedAt: null,
        guardianLinks: {
          some: {
            guardian: {
              schoolUserId,
              isActive: true,
              deletedAt: null,
            },
          },
        },
      },
      include: {
        locations: { where: { isPrimary: true, isActive: true } },
        routeStudents: { include: { route: true } },
      },
    });
  }
}
