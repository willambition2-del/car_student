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
import { SupervisorsService } from './supervisors.service';

@ApiTags('School Supervisors')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
)
@Controller('school/supervisors')
export class SupervisorsController {
  constructor(private supervisorsService: SupervisorsService) {}

  @Get()
  @ApiOperation({ summary: 'List all bus supervisors for current school' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.supervisorsService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supervisor details' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.supervisorsService.findOne(user.schoolId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new supervisor profile' })
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.supervisorsService.create(user.schoolId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update supervisor info' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) {
    return this.supervisorsService.update(user.schoolId, id, body);
  }
}
