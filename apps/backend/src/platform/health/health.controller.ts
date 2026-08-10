import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';

@ApiTags('Platform Health')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(
  PlatformRoleEnum.PLATFORM_OWNER,
  PlatformRoleEnum.PLATFORM_ADMIN,
  PlatformRoleEnum.PLATFORM_SUPPORT,
)
@Controller('platform/health')
export class PlatformHealthController {
  @Get()
  check() {
    return {
      status: 'OPERATIONAL',
      services: { db: 'UP', redis: 'UP' },
      uptime: process.uptime(),
    };
  }
}
