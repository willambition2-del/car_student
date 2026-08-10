import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FinancialService {
  constructor(private prisma: PrismaService) {}

  async findFees(
    schoolId: string,
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };

    if (status && status !== 'ALL') {
      where.status = status as any;
    }

    if (search) {
      where.student = {
        fullName: { contains: search, mode: 'insensitive' },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.transportFee.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transportFee.count({ where }),
    ]);

    return {
      items: items.map((fee) => ({
        id: fee.id,
        studentName: fee.student?.fullName || 'طالب غير محدد',
        grade: fee.student?.grade || 'الأول الابتدائي',
        feeType: fee.feeType,
        totalAmount: Number(fee.amount),
        paidAmount: Number(fee.paidAmount),
        remainingAmount: Number(fee.remainingAmount),
        status:
          fee.status === 'PAID'
            ? 'مكتمل'
            : fee.status === 'PARTIALLY_PAID'
              ? 'جزئي'
              : 'معلق',
        rawStatus: fee.status,
        dueDate: fee.dueDate,
        createdAt: fee.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createFee(
    schoolId: string,
    data: {
      studentId: string;
      feeType: string;
      amount: number;
      dueDate?: string;
      academicYear?: string;
      notes?: string;
    },
  ) {
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      throw new BadRequestException('Fee amount must be greater than zero');
    }
    const student = await this.prisma.student.findFirst({
      where: { id: data.studentId, schoolId, deletedAt: null },
      select: { id: true },
    });
    if (!student)
      throw new BadRequestException('Student does not belong to this school');

    return this.prisma.transportFee.create({
      data: {
        schoolId,
        studentId: data.studentId,
        feeType: data.feeType || 'رسوم نقل سنوية',
        amount: data.amount,
        paidAmount: 0,
        remainingAmount: data.amount,
        status: 'PENDING',
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
        academicYear: data.academicYear || '1447-1448',
        notes: data.notes,
      },
    });
  }

  async recordPayment(
    schoolId: string,
    data: {
      transportFeeId: string;
      amount: number;
      paymentMethod: string;
      referenceNumber?: string;
      notes?: string;
      recordedBy: string;
      idempotencyKey: string;
    },
  ) {
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }
    if (
      !data.idempotencyKey ||
      data.idempotencyKey.length < 8 ||
      data.idempotencyKey.length > 128
    ) {
      throw new BadRequestException('A valid idempotencyKey is required');
    }

    return this.prisma.$transaction(async (tx) => {
      const existingPayment = await tx.payment.findUnique({
        where: { idempotencyKey: data.idempotencyKey },
      });
      if (existingPayment) {
        if (
          existingPayment.schoolId !== schoolId ||
          existingPayment.transportFeeId !== data.transportFeeId ||
          Number(existingPayment.amount) !== data.amount
        ) {
          throw new ConflictException(
            'Idempotency key was already used for a different payment',
          );
        }
        return existingPayment;
      }

      const fee = await tx.transportFee.findFirst({
        where: { id: data.transportFeeId, schoolId },
        include: {
          student: {
            include: {
              guardianLinks: {
                include: {
                  guardian: true,
                },
              },
            },
          },
        },
      });

      if (!fee) {
        throw new NotFoundException('رسوم النقل غير موجودة');
      }

      const newPaid = Number(fee.paidAmount) + data.amount;
      const newRemaining = Math.max(0, Number(fee.amount) - newPaid);
      const newStatus = newRemaining === 0 ? 'PAID' : 'PARTIALLY_PAID';

      const receiptNumber = `RCP-${randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
      if (data.amount > Number(fee.remainingAmount)) {
        throw new BadRequestException(
          'Payment amount exceeds the remaining balance',
        );
      }

      const idempotencyKey = data.idempotencyKey;

      const payment = await tx.payment.create({
        data: {
          schoolId,
          transportFeeId: fee.id,
          idempotencyKey,
          receiptNumber,
          amount: data.amount,
          paymentMethod: data.paymentMethod || 'نقدي',
          referenceNumber: data.referenceNumber,
          notes: data.notes,
          recordedBy: data.recordedBy,
          recordedByName: 'مسؤول النقل والمالية',
        },
      });

      const updatedFee = await tx.transportFee.updateMany({
        where: { id: fee.id, schoolId, remainingAmount: { gte: data.amount } },
        data: {
          paidAmount: { increment: data.amount },
          remainingAmount: { decrement: data.amount },
          status: newStatus,
        },
      });
      if (updatedFee.count !== 1)
        throw new ConflictException('Fee balance changed; retry the payment');

      const guardianName =
        fee.student?.guardianLinks?.[0]?.guardian?.fullName || 'ولي الأمر';

      await tx.receipt.create({
        data: {
          schoolId,
          paymentId: payment.id,
          receiptNumber,
          studentName: fee.student.fullName,
          guardianName,
          amount: data.amount,
          paymentMethod: data.paymentMethod || 'نقدي',
          issuedBy: data.recordedBy,
          issuedByName: 'مسؤول النقل والمالية',
        },
      });

      return payment;
    });
  }

  async findReceipts(schoolId: string, page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };

    if (search) {
      where.OR = [
        { receiptNumber: { contains: search, mode: 'insensitive' } },
        { studentName: { contains: search, mode: 'insensitive' } },
        { guardianName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.receipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.receipt.count({ where }),
    ]);

    return {
      items: items.map((rcp) => ({
        id: rcp.id,
        receiptNumber: rcp.receiptNumber,
        studentName: rcp.studentName,
        guardianName: rcp.guardianName,
        amount: Number(rcp.amount),
        paymentMethod: rcp.paymentMethod,
        issuedByName: rcp.issuedByName || 'مسؤول الحسابات',
        issuedAt: rcp.issuedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
