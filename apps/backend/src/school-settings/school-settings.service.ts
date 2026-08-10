import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchoolSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(schoolId: string) {
    const settings = await this.prisma.schoolSetting.findMany({
      where: { schoolId },
    });

    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return {
      schoolInfo: {
        id: school?.id,
        nameAr: school?.nameAr,
        nameEn: school?.nameEn,
        slug: school?.slug,
        email: school?.email,
        phone: school?.phone,
        address: school?.address,
        city: school?.city,
        academicYear: school?.academicYear,
      },
      settings: settingsMap,
    };
  }

  async updateSettings(schoolId: string, settings: Record<string, string>) {
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await this.prisma.schoolSetting.upsert({
        where: { schoolId_key: { schoolId, key } },
        update: { value: String(value) },
        create: { schoolId, key, value: String(value) },
      });
    }

    return { message: 'تم حفظ الإعدادات بنجاح' };
  }

  async getEnabledFeatures(schoolId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { schoolId, status: 'ACTIVE' },
      include: {
        plan: {
          include: {
            features: { include: { feature: true } },
          },
        },
      },
    });

    const overrides = await this.prisma.schoolFeatureOverride.findMany({
      where: { schoolId },
      include: { feature: true },
    });

    const featureMap = new Map<string, { key: string; nameAr: string; isEnabled: boolean }>();

    // 1. Load from plan
    if (subscription?.plan?.features) {
      for (const pf of subscription.plan.features) {
        featureMap.set(pf.feature.key, {
          key: pf.feature.key,
          nameAr: pf.feature.nameAr,
          isEnabled: pf.isEnabled,
        });
      }
    }

    // 2. Apply overrides
    for (const ov of overrides) {
      featureMap.set(ov.feature.key, {
        key: ov.feature.key,
        nameAr: ov.feature.nameAr,
        isEnabled: ov.isEnabled,
      });
    }

    return Array.from(featureMap.values());
  }
}
