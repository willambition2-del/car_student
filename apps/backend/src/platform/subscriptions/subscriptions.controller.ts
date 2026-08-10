import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';
import { PlatformSubscriptionsService } from './subscriptions.service';

@ApiTags('Platform Subscriptions')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
@Controller('platform/subscriptions')
export class PlatformSubscriptionsController {
  constructor(private readonly service: PlatformSubscriptionsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/renew')
  renew(@Param('id') id: string, @Body() dto: any) {
    return this.service.renew(id, dto);
  }

  @Post(':id/change-plan')
  changePlan(@Param('id') id: string, @Body() dto: any) {
    return this.service.changePlan(id, dto);
  }

  @Post(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.service.suspend(id);
  }
}
