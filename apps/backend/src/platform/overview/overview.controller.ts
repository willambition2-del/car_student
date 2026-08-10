import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';
import { OverviewService } from './overview.service';

@ApiTags('Platform Overview')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(
  PlatformRoleEnum.PLATFORM_OWNER,
  PlatformRoleEnum.PLATFORM_ADMIN,
  PlatformRoleEnum.PLATFORM_SUPPORT,
  PlatformRoleEnum.PLATFORM_ACCOUNTANT,
)
@Controller('platform')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get platform overview stats' })
  getOverview() {
    return this.overviewService.getOverview();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get platform charts/statistics' })
  getStatistics() {
    return this.overviewService.getStatistics();
  }
}
