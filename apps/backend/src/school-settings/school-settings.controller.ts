import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolContextGuard } from '../common/guards/school-context.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { SchoolRoleEnum } from '../common/enums';
import { SchoolSettingsService } from './school-settings.service';

@ApiTags('School Settings')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(SchoolRoleEnum.SCHOOL_OWNER, SchoolRoleEnum.SCHOOL_ADMIN)
@Controller('school/settings')
export class SchoolSettingsController {
  constructor(private settingsService: SchoolSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get school settings and details' })
  getSettings(@CurrentUser() user: any) {
    return this.settingsService.getSettings(user.schoolId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update school settings' })
  updateSettings(
    @CurrentUser() user: any,
    @Body() body: Record<string, string>,
  ) {
    return this.settingsService.updateSettings(user.schoolId, body);
  }

  @Get('features')
  @ApiOperation({ summary: 'Get enabled features for current school' })
  getEnabledFeatures(@CurrentUser() user: any) {
    return this.settingsService.getEnabledFeatures(user.schoolId);
  }
}
