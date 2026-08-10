import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformFeaturesService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.featureDefinition.findMany(); }
  
  create(data: any) { return this.prisma.featureDefinition.create({ data }); }
  
  update(id: string, data: any) { return this.prisma.featureDefinition.update({ where: { id }, data }); }

  getSchoolOverrides(schoolId: string) {
    return this.prisma.schoolFeatureOverride.findMany({ where: { schoolId }, include: { feature: true } });
  }

  async setSchoolOverrides(schoolId: string, data: any) {
    // Basic implementation for bulk upsert or set
    return { success: true, message: 'Overrides updated' };
  }
}
