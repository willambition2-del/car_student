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
import { SchoolRoleEnum } from '../common/enums';
import { DriversService } from './drivers.service';

@ApiTags('School Drivers')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
)
@Controller('school/drivers')
export class DriversController {
  constructor(private driversService: DriversService) {}

  @Get()
  @ApiOperation({ summary: 'List all bus drivers for current school' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.driversService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver details' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.driversService.findOne(user.schoolId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new driver profile' })
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.driversService.create(user.schoolId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update driver info' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.driversService.update(user.schoolId, id, body);
  }
}
