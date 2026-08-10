import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';
import { PlatformFeaturesService } from './features.service';

@ApiTags('Platform Features')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
@Controller('platform')
export class PlatformFeaturesController {
  constructor(private readonly service: PlatformFeaturesService) {}

  @Get('features')
  findAll() {
    return this.service.findAll();
  }

  @Post('features')
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Patch('features/:id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Get('schools/:id/features')
  getSchoolOverrides(@Param('id') id: string) {
    return this.service.getSchoolOverrides(id);
  }

  @Put('schools/:id/features')
  setSchoolOverrides(@Param('id') id: string, @Body() dto: any) {
    return this.service.setSchoolOverrides(id, dto);
  }
}
