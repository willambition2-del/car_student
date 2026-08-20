import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolContextGuard } from '../common/guards/school-context.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { SchoolRoleEnum } from '../common/enums';
import { ReportsService } from './reports.service';

@ApiTags('School Reports & Analytics')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
  SchoolRoleEnum.ACCOUNTANT,
)
@Controller('school/reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('trips')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
  )
  @ApiOperation({ summary: 'Get trips and operations analytics report' })
  getTripsReport(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getTripsReport(
      user.schoolId,
      startDate,
      endDate,
    );
  }

  @Get('buses')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
  )
  @ApiOperation({ summary: 'Get fleet and buses analytics report' })
  getBusesReport(@CurrentUser() user: any) {
    return this.reportsService.getBusesReport(user.schoolId);
  }

  @Get('financial')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.ACCOUNTANT,
  )
  @ApiOperation({ summary: 'Get financial and revenue analytics report' })
  getFinancialReport(@CurrentUser() user: any) {
    return this.reportsService.getFinancialReport(user.schoolId);
  }
}
