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
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@ApiTags('School Routes')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
)
@Controller('school/routes')
export class RoutesController {
  constructor(private routesService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'List all routes for current school' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('tripType') tripType?: string,
  ) {
    return this.routesService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
      tripType,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route details' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.routesService.findOne(user.schoolId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new route' })
  create(@CurrentUser() user: any, @Body() body: CreateRouteDto) {
    return this.routesService.create(user.schoolId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update route info' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: UpdateRouteDto) {
    return this.routesService.update(user.schoolId, id, body);
  }

  @Post(':id/assign-student')
  @ApiOperation({ summary: 'Assign student to route' })
  assignStudent(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('studentId') studentId: string,
    @Body('stopId') stopId?: string,
  ) {
    return this.routesService.assignStudent(
      user.schoolId,
      id,
      studentId,
      stopId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete route' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.routesService.remove(user.schoolId, id);
  }
}
