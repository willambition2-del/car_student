import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../common/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.accessSecret'),
      issuer: configService.get<string>('jwt.issuer'),
      audience: configService.get<string>('jwt.audience'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('رمز مميز غير صالح');
    }

    if (payload.userType === 'platform') {
      const user = await this.prisma.platformUser.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive || user.deletedAt) {
        throw new UnauthorizedException('المستخدم غير موجود أو غير مفعل');
      }

      return {
        ...payload,
        id: user.id,
        mustChangePassword: user.mustChangePassword,
      };
    } else if (payload.userType === 'school') {
      const user = await this.prisma.schoolUser.findUnique({
        where: { id: payload.sub },
        include: {
          school: true,
        },
      });

      if (!user || !user.isActive || user.deletedAt) {
        throw new UnauthorizedException('المستخدم غير موجود أو غير مفعل');
      }

      if (user.role === 'DRIVER') {
        throw new ForbiddenException('تسجيل دخول السائق غير متاح');
      }

      const schoolStatus = user.school.status;
      if (
        schoolStatus === 'SUSPENDED' ||
        schoolStatus === 'EXPIRED' ||
        schoolStatus === 'ARCHIVED'
      ) {
        throw new ForbiddenException(
          `حساب المدرسة ${schoolStatus === 'SUSPENDED' ? 'موقوف' : schoolStatus === 'EXPIRED' ? 'منتهي الصلاحية' : 'مؤرشف'}`,
        );
      }

      return {
        ...payload,
        id: user.id,
        mustChangePassword: user.mustChangePassword,
      };
    }

    throw new UnauthorizedException('نوع المستخدم غير صالح');
  }
}
