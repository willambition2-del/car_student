import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OverviewService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalSchools, activeSchools, trialSchools, suspendedSchools,
      totalStudents, totalBuses, expiringSubscriptionsCount
    ] = await Promise.all([
      this.prisma.school.count(),
      this.prisma.school.count({ where: { status: 'ACTIVE' } }),
      this.prisma.school.count({ where: { status: 'TRIAL' } }),
      this.prisma.school.count({ where: { status: 'SUSPENDED' } }),
      this.prisma.student.count(),
      this.prisma.bus.count(),
      this.prisma.subscription.count({ where: { endDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } } })
    ]);

    // Dummy MRR calculation
    const monthlyRecurringRevenue = 50000;
    const systemHealthStatus = 'OPERATIONAL';

    return {
      totalSchools, activeSchools, trialSchools, suspendedSchools,
      totalStudents, totalBuses, monthlyRecurringRevenue,
      systemHealthStatus, expiringSubscriptionsCount
    };
  }

  async getStatistics() {
    return {
      mrrGrowth: [{ month: 'Jan', value: 10000 }, { month: 'Feb', value: 15000 }],
      schoolGrowth: [{ month: 'Jan', count: 10 }, { month: 'Feb', count: 15 }],
      distributionByPlan: [{ plan: 'Basic', count: 50 }, { plan: 'Pro', count: 30 }]
    };
  }
}
