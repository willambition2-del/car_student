import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';
import { PlatformInvoicesService } from './invoices.service';

@ApiTags('Platform Invoices')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(
  PlatformRoleEnum.PLATFORM_OWNER,
  PlatformRoleEnum.PLATFORM_ADMIN,
  PlatformRoleEnum.PLATFORM_ACCOUNTANT,
)
@Controller('platform/invoices')
export class PlatformInvoicesController {
  constructor(private readonly service: PlatformInvoicesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() dto: any) {
    return this.service.addPayment(id, dto);
  }
}
