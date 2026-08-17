import { ForbiddenException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export async function assertSchoolOperational(
  tx: Prisma.TransactionClient,
  schoolId: string,
  options?: {
    actorRole?: string;
    checkMaxStudents?: boolean;
    checkMaxBuses?: boolean;
  }
) {
  // If platform admin, allow overriding limits and operational suspension blocks
  // Since platform admins manage schools, they can always perform operations.
  const isPlatformAdmin = options?.actorRole === 'PLATFORM';

  await tx.$executeRaw`SELECT id FROM schools WHERE id = ${schoolId} FOR UPDATE`;

  const school = await tx.school.findUnique({
    where: { id: schoolId },
    include: {
      subscriptions: {
        where: { status: 'ACTIVE' },
        include: { plan: true },
      }
    }
  });

  if (!school) {
    throw new BadRequestException('المدرسة غير موجودة');
  }

  // Enforce Suspension / Expiry for school users
  if (!isPlatformAdmin) {
    if (school.status === 'SUSPENDED') {
      throw new ForbiddenException('العملية مرفوضة: حساب المدرسة موقوف مؤقتاً');
    }
    
    if (school.status === 'EXPIRED') {
      throw new ForbiddenException('العملية مرفوضة: اشتراك المدرسة منتهي');
    }

    if (school.status === 'ARCHIVED') {
      throw new ForbiddenException('العملية مرفوضة: حساب المدرسة مؤرشف');
    }
  }

  const activeSubscription = school.subscriptions[0];
  
  if (!isPlatformAdmin && !activeSubscription && school.status !== 'TRIAL') {
     throw new ForbiddenException('العملية مرفوضة: لا يوجد اشتراك فعال');
  }

  // Check SaaS Limits
  if (options?.checkMaxStudents && activeSubscription?.plan?.maxStudents) {
    const currentStudentCount = await tx.student.count({
      where: { schoolId, deletedAt: null }
    });
    if (currentStudentCount >= activeSubscription.plan.maxStudents) {
      throw new BadRequestException(`لا يمكن المتابعة. تم تجاوز الحد الأقصى للطلاب المسموح به (${activeSubscription.plan.maxStudents})`);
    }
  }

  if (options?.checkMaxBuses && activeSubscription?.plan?.maxBuses) {
    const currentBusCount = await tx.bus.count({
      where: { schoolId, deletedAt: null }
    });
    if (currentBusCount >= activeSubscription.plan.maxBuses) {
      throw new BadRequestException(`لا يمكن المتابعة. تم تجاوز الحد الأقصى للحافلات المسموح به (${activeSubscription.plan.maxBuses})`);
    }
  }

  return { school, activeSubscription };
}
