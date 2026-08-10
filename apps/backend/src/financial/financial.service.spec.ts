import { BadRequestException } from '@nestjs/common';
import { FinancialService } from './financial.service';

describe('FinancialService payment safety', () => {
  let service: FinancialService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      student: { findFirst: jest.fn() },
      transportFee: { create: jest.fn() },
      $transaction: jest.fn(),
    };
    service = new FinancialService(prisma);
  });

  it('rejects creating a fee for a student outside the school', async () => {
    prisma.student.findFirst.mockResolvedValue(null);

    await expect(
      service.createFee('school-a', {
        studentId: 'student-b',
        feeType: 'annual',
        amount: 100,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.transportFee.create).not.toHaveBeenCalled();
  });

  it('rejects non-positive payments before opening a transaction', async () => {
    await expect(
      service.recordPayment('school-a', {
        transportFeeId: 'fee-a',
        amount: 0,
        paymentMethod: 'cash',
        recordedBy: 'accountant-a',
        idempotencyKey: 'payment-001',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('requires a client-stable idempotency key', async () => {
    await expect(
      service.recordPayment('school-a', {
        transportFeeId: 'fee-a',
        amount: 100,
        paymentMethod: 'cash',
        recordedBy: 'accountant-a',
        idempotencyKey: '',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
