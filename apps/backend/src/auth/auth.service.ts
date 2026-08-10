import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { randomInt, randomUUID } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from '../common/types';

interface OtpRecord {
  hash: string;
  expiresAt: number;
  attempts: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // In-memory OTP storage for simplicity in this phase
  private otpStore = new Map<string, OtpRecord>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Periodically clean up expired OTPs (every 5 mins)
    const cleanupTimer = setInterval(
      () => {
        const now = Date.now();
        for (const [email, record] of this.otpStore.entries()) {
          if (record.expiresAt < now) {
            this.otpStore.delete(email);
          }
        }
      },
      5 * 60 * 1000,
    );
    cleanupTimer.unref();
  }
  private otpKey(email: string, schoolSlug?: string) {
    return `${email.trim().toLowerCase()}::${schoolSlug?.trim().toLowerCase() || 'platform-or-unique'}`;
  }

  private async resolveIdentity(
    email: string,
    schoolSlug?: string,
  ): Promise<{ user: any; userType: 'platform' | 'school' } | null> {
    const normalizedEmail = email.trim();

    if (!schoolSlug) {
      const platformUser = await this.prisma.platformUser.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      });
      if (platformUser) return { user: platformUser, userType: 'platform' };
    }

    const schoolUsers = await this.prisma.schoolUser.findMany({
      where: {
        email: { equals: normalizedEmail, mode: 'insensitive' },
        ...(schoolSlug ? { school: { slug: schoolSlug.trim() } } : {}),
      },
      include: { school: true },
      take: 2,
    });

    // Without a school slug, duplicate tenant-local emails are ambiguous.
    if (schoolUsers.length !== 1) return null;
    return { user: schoolUsers[0], userType: 'school' };
  }
  private async assertRefreshSubjectActive(payload: JwtPayload) {
    if (payload.userType === 'platform') {
      const user = await this.prisma.platformUser.findFirst({
        where: { id: payload.sub, isActive: true, deletedAt: null },
      });
      if (!user) throw new UnauthorizedException('Invalid refresh token');
      return;
    }

    if (payload.userType === 'school' && payload.schoolId) {
      const user = await this.prisma.schoolUser.findFirst({
        where: {
          id: payload.sub,
          schoolId: payload.schoolId,
          isActive: true,
          deletedAt: null,
          school: { status: { in: ['TRIAL', 'ACTIVE'] } },
        },
      });
      if (user) return;
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const { email, password, deviceInfo, schoolSlug } = loginDto;

    const identity = await this.resolveIdentity(email, schoolSlug);
    const user = identity?.user;
    const userType = identity?.userType;

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    // 2. Verify Password
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    // 3. Check Active Status
    if (!user.isActive) {
      throw new UnauthorizedException('الحساب غير مفعل');
    }

    // 4. Check School Status (if school user)
    let activeSubscription = null;
    let enabledFeatures: string[] = [];
    if (userType === 'school') {
      const schoolStatus = user.school.status;
      if (['SUSPENDED', 'EXPIRED', 'ARCHIVED'].includes(schoolStatus)) {
        throw new ForbiddenException(
          `حساب المدرسة ${schoolStatus === 'SUSPENDED' ? 'موقوف' : schoolStatus === 'EXPIRED' ? 'منتهي الصلاحية' : 'مؤرشف'}`,
        );
      }

      // Check Subscription
      activeSubscription = await this.prisma.subscription.findFirst({
        where: {
          schoolId: user.schoolId,
          status: 'ACTIVE',
        },
        include: { plan: true },
        orderBy: { endDate: 'desc' },
      });

      if (!activeSubscription && schoolStatus !== 'TRIAL') {
        throw new ForbiddenException('لا يوجد اشتراك فعال للمدرسة');
      }

      // Load school permissions/features if needed
      // (Simplified for now)
      const overrides = await this.prisma.schoolFeatureOverride.findMany({
        where: { schoolId: user.schoolId, isEnabled: true },
        include: { feature: true },
      });
      enabledFeatures = overrides.map((o) => o.feature.key);
    }

    // 5. Update last login
    if (userType === 'platform') {
      await this.prisma.platformUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date(), lastLoginIp: ipAddress },
      });
    } else {
      await this.prisma.schoolUser.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date(), lastLoginIp: ipAddress },
      });
    }

    // 6. Generate Tokens
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      userType,
      schoolId: userType === 'school' ? user.schoolId : undefined,
      type: 'access',
    };

    const tokens = await this.generateTokens(
      payload,
      deviceInfo,
      ipAddress,
      userAgent,
    );

    // 7. Format Response
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        mustChangePassword: user.mustChangePassword,
      },
      school:
        userType === 'school'
          ? {
              id: user.school.id,
              nameAr: user.school.nameAr,
              slug: user.school.slug,
              status: user.school.status,
            }
          : null,
      subscription: activeSubscription
        ? {
            planName: activeSubscription.plan.nameAr,
            status: activeSubscription.status,
            endDate: activeSubscription.endDate,
          }
        : null,
      permissions: [], // Implement permissions logic as needed
      features: enabledFeatures,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async generateTokens(
    payload: JwtPayload,
    deviceInfo?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const accessSecret =
      this.configService.getOrThrow<string>('jwt.accessSecret');
    const refreshSecret =
      this.configService.getOrThrow<string>('jwt.refreshSecret');
    const issuer = this.configService.get<string>('jwt.issuer');
    const audience = this.configService.get<string>('jwt.audience');

    // Generate Access Token
    const accessToken = this.jwtService.sign(payload as any, {
      secret: accessSecret,
      expiresIn: (this.configService.get<string>('jwt.accessExpiry') ||
        '15m') as any,
      issuer,
      audience,
      algorithm: 'HS256',
    });

    // Generate Refresh Token String
    const refreshTokenStr = randomUUID();
    const refreshPayload = {
      ...payload,
      type: 'refresh',
      tokenStr: refreshTokenStr,
    };
    const refreshToken = this.jwtService.sign(refreshPayload as any, {
      secret: refreshSecret,
      expiresIn: (this.configService.get<string>('jwt.refreshExpiry') ||
        '7d') as any,
      issuer,
      audience,
      algorithm: 'HS256',
    });

    // Hash Refresh Token for DB
    const tokenHash = await argon2.hash(refreshTokenStr);

    // Create session (expires in 7 days by default)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await this.prisma.session.create({
      data: {
        userId: payload.sub,
        userType: payload.userType!,
        ipAddress,
        userAgent,
        deviceInfo,
        expiresAt,
      },
    });

    // Save refresh token to DB
    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: payload.sub,
        userType: payload.userType!,
        deviceInfo,
        ipAddress,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, ipAddress?: string) {
    try {
      // 1. Verify JWT signature of refresh token
      const refreshSecret =
        this.configService.getOrThrow<string>('jwt.refreshSecret');
      const decoded = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: refreshSecret,
        issuer: this.configService.get<string>('jwt.issuer'),
        audience: this.configService.get<string>('jwt.audience'),
        algorithms: ['HS256'],
      });

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('رمز التحديث غير صالح');
      }

      await this.assertRefreshSubjectActive(decoded as JwtPayload);
      // 2. Find all active tokens for this user
      const activeTokens = await this.prisma.refreshToken.findMany({
        where: {
          userId: decoded.sub,
          userType: decoded.userType,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      // 3. Find the matching token hash
      let matchedToken = null;
      for (const token of activeTokens) {
        if (await argon2.verify(token.tokenHash, decoded.tokenStr)) {
          matchedToken = token;
          break;
        }
      }

      if (!matchedToken) {
        // Reuse detection: If we can't find it in active, maybe it was revoked
        const allTokens = await this.prisma.refreshToken.findMany({
          where: { userId: decoded.sub, userType: decoded.userType },
        });

        let wasRevoked = false;
        for (const token of allTokens) {
          if (await argon2.verify(token.tokenHash, decoded.tokenStr)) {
            wasRevoked = !!token.revokedAt;
            break;
          }
        }

        if (wasRevoked) {
          // A revoked token was used. Revoke ALL tokens for this user as a security measure
          await this.prisma.refreshToken.updateMany({
            where: { userId: decoded.sub, userType: decoded.userType },
            data: { revokedAt: new Date() },
          });
          this.logger.warn(
            `Refresh token reuse detected for user ${decoded.sub}. All tokens revoked.`,
          );
        }

        throw new UnauthorizedException(
          'رمز التحديث غير صالح أو منتهي الصلاحية',
        );
      }

      // 4. Revoke the old token
      const rotation = await this.prisma.refreshToken.updateMany({
        where: { id: matchedToken.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      if (rotation.count !== 1) {
        await this.prisma.refreshToken.updateMany({
          where: { userId: decoded.sub, userType: decoded.userType },
          data: { revokedAt: new Date() },
        });
        throw new UnauthorizedException('Refresh token reuse detected');
      }

      // 5. Generate new tokens
      const payload: JwtPayload = {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        userType: decoded.userType,
        schoolId: decoded.schoolId,
        type: 'access',
      };

      const tokens = await this.generateTokens(
        payload,
        matchedToken.deviceInfo || undefined,
        ipAddress,
      );
      return tokens;
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('رمز التحديث غير صالح');
    }
  }

  async logout(
    userId: string,
    userType: string,
    refreshTokenDto: RefreshTokenDto,
  ) {
    try {
      const refreshSecret =
        this.configService.getOrThrow<string>('jwt.refreshSecret');
      const decoded = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: refreshSecret,
        issuer: this.configService.get<string>('jwt.issuer'),
        audience: this.configService.get<string>('jwt.audience'),
        algorithms: ['HS256'],
      });

      if (decoded.sub !== userId || decoded.userType !== userType) {
        throw new UnauthorizedException();
      }

      const activeTokens = await this.prisma.refreshToken.findMany({
        where: {
          userId,
          userType,
          revokedAt: null,
        },
      });

      for (const token of activeTokens) {
        if (await argon2.verify(token.tokenHash, decoded.tokenStr)) {
          await this.prisma.refreshToken.update({
            where: { id: token.id },
            data: { revokedAt: new Date() },
          });
          break;
        }
      }
      return { success: true, message: 'تم تسجيل الخروج بنجاح' };
    } catch (e) {
      // Just return success even if token is invalid during logout
      return { success: true, message: 'تم تسجيل الخروج بنجاح' };
    }
  }

  async logoutAll(userId: string, userType: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, userType, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await this.prisma.session.updateMany({
      where: { userId, userType, isActive: true },
      data: { isActive: false },
    });

    return { success: true, message: 'تم تسجيل الخروج من جميع الأجهزة' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const { email, schoolSlug } = dto;
    const identity = await this.resolveIdentity(email, schoolSlug);
    const user = identity?.user;

    if (!user || user.deletedAt) {
      // Return success anyway to prevent email enumeration
      return {
        success: true,
        message: 'إذا كان البريد الإلكتروني مسجلاً، فسيصلك رابط إعادة التعيين',
      };
    }

    const token = randomUUID();
    const tokenHash = await argon2.hash(token);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        userType: identity.userType,
        expiresAt,
      },
    });

    console.log(`[Development] Password reset token for ${email}: ${token}`);

    return {
      success: true,
      message: 'إذا كان البريد الإلكتروني مسجلاً، فسيصلك رابط إعادة التعيين',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    // Keeping for backwards compatibility if needed, but not used for tokens
    const { email, otp, schoolSlug } = dto;
    const key = this.otpKey(email, schoolSlug);
    const record = this.otpStore.get(key);

    if (!record || record.expiresAt < Date.now()) {
      if (record) {
        this.otpStore.delete(key);
      }
      throw new BadRequestException('رمز التحقق غير صالح أو منتهي الصلاحية');
    }

    const isValid = await argon2.verify(record.hash, otp);
    if (!isValid) {
      record.attempts += 1;
      if (record.attempts >= 5) {
        this.otpStore.delete(key);
      }
      throw new BadRequestException('رمز التحقق غير صالح');
    }

    return { success: true, message: 'رمز التحقق صحيح' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp: token, newPassword, schoolSlug } = dto;

    const identity = await this.resolveIdentity(email, schoolSlug);
    if (!identity || identity.user.deletedAt) {
      throw new BadRequestException('طلب غير صالح');
    }

    const resetTokens = await this.prisma.passwordResetToken.findMany({
      where: {
        userId: identity.user.id,
        userType: identity.userType,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    let matchedToken = null;
    for (const rt of resetTokens) {
      if (await argon2.verify(rt.tokenHash, token)) {
        matchedToken = rt;
        break;
      }
    }

    if (!matchedToken) {
      throw new BadRequestException('الرابط غير صالح أو منتهي الصلاحية');
    }

    // Hash new password
    const passwordHash = await argon2.hash(newPassword);

    if (identity.userType === 'platform') {
      await this.prisma.platformUser.update({
        where: { id: identity.user.id },
        data: { passwordHash, mustChangePassword: false, passwordChangedAt: new Date() },
      });
      await this.logoutAll(identity.user.id, 'platform');
    } else {
      await this.prisma.schoolUser.update({
        where: { id: identity.user.id },
        data: { passwordHash, mustChangePassword: false, passwordChangedAt: new Date() },
      });
      await this.logoutAll(identity.user.id, 'school');
    }

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { id: matchedToken.id },
      data: { usedAt: new Date() },
    });

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  }

  async changePassword(
    userId: string,
    userType: string,
    dto: ChangePasswordDto,
  ) {
    const { currentPassword, newPassword } = dto;

    let user: any = null;
    if (userType === 'platform') {
      user = await this.prisma.platformUser.findUnique({
        where: { id: userId },
      });
    } else {
      user = await this.prisma.schoolUser.findUnique({ where: { id: userId } });
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      currentPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('كلمة المرور الحالية غير صحيحة');
    }

    const passwordHash = await argon2.hash(newPassword);

    if (userType === 'platform') {
      await this.prisma.platformUser.update({
        where: { id: userId },
        data: { 
          passwordHash,
          mustChangePassword: false,
          passwordChangedAt: new Date()
        },
      });
    } else {
      await this.prisma.schoolUser.update({
        where: { id: userId },
        data: { 
          passwordHash,
          mustChangePassword: false,
          passwordChangedAt: new Date()
        },
      });
    }

    await this.logoutAll(userId, userType);

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  }

  async getProfile(userId: string, userType: string) {
    if (userType === 'platform') {
      const user = await this.prisma.platformUser.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          phone: true,
          avatarUrl: true,
          isActive: true,
        },
      });
      return user;
    } else {
      const user = await this.prisma.schoolUser.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          phone: true,
          avatarUrl: true,
          isActive: true,
          schoolId: true,
          school: { select: { nameAr: true, slug: true, status: true } },
        },
      });
      return user;
    }
  }

  async getSessions(userId: string, userType: string) {
    return this.prisma.session.findMany({
      where: { userId, userType, isActive: true },
      orderBy: { lastActiveAt: 'desc' },
    });
  }

  async revokeSession(userId: string, userType: string, sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (
      !session ||
      session.userId !== userId ||
      session.userType !== userType
    ) {
      throw new ForbiddenException();
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    return { success: true, message: 'تم تسجيل الخروج من الجلسة بنجاح' };
  }
}
