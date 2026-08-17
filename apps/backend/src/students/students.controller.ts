import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolContextGuard } from '../common/guards/school-context.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { SchoolRoleEnum } from '../common/enums';
import { StudentsService } from './students.service';
import { ProximityService } from './proximity.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ProximitySuggestionDto } from './dto/proximity-suggestion.dto';

@ApiTags('School Students')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
  SchoolRoleEnum.DATA_ENTRY,
)
@Controller('school/students')
export class StudentsController {
  constructor(
    private studentsService: StudentsService,
    private proximityService: ProximityService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all students for current school' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('grade') grade?: string,
  ) {
    return this.studentsService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
      grade,
    );
  }

  @Post('proximity/suggestions')
  @ApiOperation({ summary: 'Generate student proximity suggestions (Read Only)' })
  @Roles(SchoolRoleEnum.TRANSPORT_MANAGER, SchoolRoleEnum.SCHOOL_ADMIN)
  async generateProximitySuggestions(
    @CurrentUser() user: any,
    @Body() body: ProximitySuggestionDto,
  ) {
    return this.proximityService.findStudentsNearPoint(
      user.schoolId,
      body.targetLat,
      body.targetLon,
      body.radiusMeters,
      body.maxCapacity,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student details' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.studentsService.findOne(user.schoolId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new student' })
  create(@CurrentUser() user: any, @Body() body: CreateStudentDto) {
    return this.studentsService.create(user.schoolId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student info' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: UpdateStudentDto) {
    return this.studentsService.update(user.schoolId, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete student' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.studentsService.remove(user.schoolId, id);
  }
}
