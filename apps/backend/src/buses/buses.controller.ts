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
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';

@ApiTags('School Buses')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
)
@Controller('school/buses')
export class BusesController {
  constructor(private busesService: BusesService) {}

  @Get()
  @ApiOperation({ summary: 'List all buses for current school' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.busesService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
      status,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bus details' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.busesService.findOne(user.schoolId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new bus' })
  create(@CurrentUser() user: any, @Body() body: CreateBusDto) {
    return this.busesService.create(user.schoolId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update bus info' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: UpdateBusDto) {
    return this.busesService.update(user.schoolId, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete bus' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.busesService.remove(user.schoolId, id);
  }
}
