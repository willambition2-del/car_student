import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { FEATURE_KEY } from '../decorators/require-feature.decorator';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFeature = this.reflector.getAllAndOverride<string>(
      FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredFeature) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Platform users bypass feature checks or maybe we just allow them
    if (!user) return false;
    if (user.userType === 'platform') return true;

    if (!user.schoolId) {
      throw new ForbiddenException('المدرسة غير محددة');
    }

    // Check if feature is enabled via plan or override
    // 1. Get active subscription
    const activeSub = await this.prisma.subscription.findFirst({
      where: {
        schoolId: user.schoolId,
        status: 'ACTIVE',
      },
      orderBy: { endDate: 'desc' },
    });

    let planFeatureEnabled = false;
    if (activeSub) {
      const planFeature = await this.prisma.planFeature.findFirst({
        where: {
          planId: activeSub.planId,
          feature: { key: requiredFeature },
        },
      });
      if (planFeature && planFeature.isEnabled) {
        planFeatureEnabled = true;
      }
    }

    // 2. Check override
    const override = await this.prisma.schoolFeatureOverride.findFirst({
      where: {
        schoolId: user.schoolId,
        feature: { key: requiredFeature },
      },
    });

    let isEnabled = planFeatureEnabled;
    if (override) {
      isEnabled = override.isEnabled;
    }

    if (!isEnabled) {
      throw new ForbiddenException(
        `ميزة ${requiredFeature} غير مفعلة في باقتك الحالية`,
      );
    }

    return true;
  }
}
