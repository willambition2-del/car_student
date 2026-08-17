import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolContextGuard } from '../common/guards/school-context.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { SchoolRoleEnum, StudentTripStatus } from '../common/enums';
import { TripsService } from './trips.service';
import { StartTripDto } from './dto/start-trip.dto';
import { TripSyncBatchDto } from './dto/trip-sync-batch.dto';

@ApiTags('School Trips & Operations')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
  SchoolRoleEnum.SUPERVISOR,
)
@Controller('school/trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'List all trips for current school' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.tripsService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
      status,
      date,
      user,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip details and student roster' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tripsService.findOne(user.schoolId, id, user);
  }

  @Post('start')
  @ApiOperation({ summary: 'Start a new trip' })
  startTrip(@CurrentUser() user: any, @Body() body: StartTripDto) {
    return this.tripsService.startTrip(user.schoolId, body, user);
  }

  @Post(':id/student-status')
  @ApiOperation({ summary: 'Update student status on trip roster' })
  updateStudentStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('studentId') studentId: string,
    @Body('status') status: StudentTripStatus,
    @Body('notes') notes?: string,
  ) {
    return this.tripsService.updateStudentStatus(
      user.schoolId,
      id,
      studentId,
      status,
      notes,
      user,
    );
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete trip' })
  completeTrip(@CurrentUser() user: any, @Param('id') id: string) {
    return this.tripsService.completeTrip(user.schoolId, id, user);
  }

  @Post('offline-sync')
  @ApiOperation({ summary: 'Batch sync offline operational events' })
  syncBatch(@CurrentUser() user: any, @Body() body: TripSyncBatchDto) {
    return this.tripsService.syncBatch(user.schoolId, body.events, user);
  }
}
