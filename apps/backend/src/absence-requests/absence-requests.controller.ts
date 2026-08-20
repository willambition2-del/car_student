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
import { AbsenceRequestsService } from './absence-requests.service';

@ApiTags('School Absence Requests')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
  SchoolRoleEnum.PARENT,
)
@Controller('school/absence-requests')
export class AbsenceRequestsController {
  constructor(private absenceRequestsService: AbsenceRequestsService) {}

  @Get()
  @ApiOperation({ summary: 'List all absence requests' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.absenceRequestsService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      status,
      user,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get absence request details' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.absenceRequestsService.findOne(user.schoolId, id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create new absence request' })
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.absenceRequestsService.create(user.schoolId, body, user);
  }

  @Post(':id/approve')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
  )
  @ApiOperation({ summary: 'Approve absence request' })
  approve(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.absenceRequestsService.approve(user.schoolId, id, notes);
  }

  @Post(':id/reject')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
  )
  @ApiOperation({ summary: 'Reject absence request' })
  reject(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.absenceRequestsService.reject(user.schoolId, id, reason);
  }
}
