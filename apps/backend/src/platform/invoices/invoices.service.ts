import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformInvoicesService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } }); }
  
  create(data: any) { return this.prisma.invoice.create({ data }); }
  
  findOne(id: string) { return this.prisma.invoice.findUnique({ where: { id }, include: { platformPayments: true } }); }

  addPayment(id: string, data: any) {
    return this.prisma.platformPayment.create({
      data: {
        invoiceId: id,
        ...data
      }
    });
  }
}
