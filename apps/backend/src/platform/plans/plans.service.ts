import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformPlansService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } }); }
  
  create(data: any) { return this.prisma.plan.create({ data }); }
  
  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id }, include: { features: true } });
    if (!plan) throw new NotFoundException();
    return plan;
  }
  
  update(id: string, data: any) { return this.prisma.plan.update({ where: { id }, data }); }
}
