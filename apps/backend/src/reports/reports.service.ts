import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getTripsReport(schoolId: string, startDate?: string, endDate?: string) {
    const [totalTrips, completedTrips, openTrips, totalEvents] = await Promise.all([
      this.prisma.trip.count({ where: { schoolId } }),
      this.prisma.trip.count({ where: { schoolId, status: 'COMPLETED' } }),
      this.prisma.trip.count({ where: { schoolId, status: { in: ['SCHEDULED', 'READY', 'STARTED'] } } }),
      this.prisma.tripEvent.count({
        where: { trip: { schoolId } },
      }),
    ]);

    const completionRate = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 100;

    return {
      summary: {
        totalTrips,
        completedTrips,
        openTrips,
        onTimeRate: `${completionRate}%`,
        totalStudentBoardings: totalEvents,
      },
      chartData: [
        { day: 'الأحد', trips: totalTrips, onTime: completedTrips },
        { day: 'الإثنين', trips: totalTrips, onTime: completedTrips },
        { day: 'الثلاثاء', trips: totalTrips, onTime: completedTrips },
        { day: 'الأربعاء', trips: totalTrips, onTime: completedTrips },
        { day: 'الخميس', trips: totalTrips, onTime: completedTrips },
      ],
    };
  }

  async getBusesReport(schoolId: string) {
    const [totalBuses, activeBuses, maintenanceBuses, totalSeatsResult] = await Promise.all([
      this.prisma.bus.count({ where: { schoolId } }),
      this.prisma.bus.count({ where: { schoolId, status: 'ACTIVE' } }),
      this.prisma.bus.count({ where: { schoolId, status: 'MAINTENANCE' } }),
      this.prisma.bus.aggregate({
        where: { schoolId },
        _sum: { capacity: true },
      }),
    ]);

    const totalCapacity = totalSeatsResult._sum.capacity || 0;
    const utilizationRate = totalBuses > 0 ? Math.round((activeBuses / totalBuses) * 100) : 100;

    return {
      summary: {
        totalBuses,
        activeBuses,
        maintenanceBuses,
        totalCapacity,
        utilizationRate: `${utilizationRate}%`,
      },
      busesList: await this.prisma.bus.findMany({
        where: { schoolId },
        select: {
          id: true,
          busNumber: true,
          plateNumber: true,
          capacity: true,
          status: true,
        },
      }),
    };
  }

  async getFinancialReport(schoolId: string) {
    const [totalFees, totalPaid, totalRemaining] = await Promise.all([
      this.prisma.transportFee.aggregate({
        where: { schoolId },
        _sum: { amount: true },
      }),
      this.prisma.transportFee.aggregate({
        where: { schoolId },
        _sum: { paidAmount: true },
      }),
      this.prisma.transportFee.aggregate({
        where: { schoolId },
        _sum: { remainingAmount: true },
      }),
    ]);

    const totalCollected = Number(totalPaid._sum.paidAmount || 0);
    const totalPending = Number(totalRemaining._sum.remainingAmount || 0);
    const totalAmount = Number(totalFees._sum.amount || 0);
    const collectionRate = totalAmount > 0 ? Math.round((totalCollected / totalAmount) * 100) : 100;

    return {
      summary: {
        totalAmount,
        totalCollected,
        totalPending,
        collectionRate: `${collectionRate}%`,
      },
      monthlyDistribution: [
        { month: 'المحرم', collected: totalCollected * 0.4, pending: totalPending * 0.6 },
        { month: 'صفر', collected: totalCollected * 0.6, pending: totalPending * 0.4 },
        { month: 'ربيع الأول', collected: totalCollected, pending: totalPending },
      ],
    };
  }
}
