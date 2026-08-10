import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformSubscriptionsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.subscription.findMany({ include: { school: { select: { nameAr: true } }, plan: true } }); }
  
  findOne(id: string) { return this.prisma.subscription.findUnique({ where: { id }, include: { school: true, plan: true, history: true } }); }

  renew(id: string, dto: any) {
    // Add logic to extend end date
    return this.prisma.subscription.update({
      where: { id },
      data: { endDate: new Date(dto.newEndDate) }
    });
  }

  changePlan(id: string, dto: any) {
    return this.prisma.subscription.update({
      where: { id },
      data: { planId: dto.planId }
    });
  }

  suspend(id: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: { status: 'SUSPENDED' }
    });
  }
}
