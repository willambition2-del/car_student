import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolContextGuard } from '../common/guards/school-context.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { SchoolRoleEnum } from '../common/enums';
import { EmergencyService } from './emergency.service';

@ApiTags('School Emergency Reports')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
  SchoolRoleEnum.SUPERVISOR,
)
@Controller('school/emergency')
export class EmergencyController {
  constructor(private emergencyService: EmergencyService) {}

  @Get('reports')
  @ApiOperation({ summary: 'List all emergency reports' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.emergencyService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      status,
      user,
    );
  }

  @Post('reports')
  @ApiOperation({ summary: 'Create emergency report' })
  createReport(@CurrentUser() user: any, @Body() body: any) {
    return this.emergencyService.createReport(user.schoolId, body, user);
  }

  @Post('reports/:id/resolve')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
  )
  @ApiOperation({ summary: 'Resolve emergency report' })
  resolveReport(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.emergencyService.resolveReport(user.schoolId, id, notes);
  }
}
