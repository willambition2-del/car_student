import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  Ip,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { Public, CurrentUser } from '../common/decorators';
import { SkipPasswordChange } from '../common/decorators/skip-password-change.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login for platform and school users' })
  login(
    @Body() loginDto: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(loginDto, ipAddress, userAgent);
  }

  @Public()
  @SkipPasswordChange()
  @Post('refresh')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() refreshTokenDto: RefreshTokenDto, @Ip() ipAddress: string) {
    return this.authService.refreshToken(refreshTokenDto, ipAddress);
  }

  @Post('logout')
  @SkipPasswordChange()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke current refresh token' })
  logout(@CurrentUser() user: any, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(user.id, user.userType, refreshTokenDto);
  }

  @Post('logout-all')
  @SkipPasswordChange()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke all refresh tokens for user' })
  logoutAll(@CurrentUser() user: any) {
    return this.authService.logoutAll(user.id, user.userType);
  }

  @Public()
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP for password reset' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('verify-otp')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with OTP' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('change-password')
  @SkipPasswordChange()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password while logged in' })
  changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, user.userType, dto);
  }

  @Get('me')
  @SkipPasswordChange()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id, user.userType);
  }

  @Get('sessions')
  @SkipPasswordChange()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List active sessions' })
  getSessions(@CurrentUser() user: any) {
    return this.authService.getSessions(user.id, user.userType);
  }

  @Delete('sessions/:id')
  @SkipPasswordChange()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke specific session' })
  revokeSession(@CurrentUser() user: any, @Param('id') sessionId: string) {
    return this.authService.revokeSession(user.id, user.userType, sessionId);
  }
}
