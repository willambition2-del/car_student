import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;
    if (user.userType === 'platform') return true; // Platform users bypass

    if (!user.schoolId) {
      throw new ForbiddenException('المدرسة غير محددة');
    }

    // Check if school has ACTIVE or TRIAL subscription
    const activeSub = await this.prisma.subscription.findFirst({
      where: {
        schoolId: user.schoolId,
        status: { in: ['ACTIVE', 'TRIAL'] },
      },
      orderBy: { endDate: 'desc' },
    });

    if (!activeSub) {
      throw new ForbiddenException(
        'لا يوجد اشتراك فعال. يرجى تجديد الاشتراك للمتابعة.',
      );
    }

    return true;
  }
}
