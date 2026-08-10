import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';
import { PlatformPlansService } from './plans.service';

@ApiTags('Platform Plans')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
@Controller('platform/plans')
export class PlatformPlansController {
  constructor(private readonly plansService: PlatformPlansService) {}

  @Get()
  @ApiOperation({ summary: 'List plans' })
  findAll() {
    return this.plansService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create plan' })
  create(@Body() dto: any) {
    return this.plansService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get plan' })
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update plan' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.plansService.update(id, dto);
  }
}
