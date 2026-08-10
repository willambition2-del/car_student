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
import { GuardiansService } from './guardians.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@ApiTags('School Guardians')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.DATA_ENTRY,
)
@Controller('school/guardians')
export class GuardiansController {
  constructor(private guardiansService: GuardiansService) {}

  @Get()
  @ApiOperation({ summary: 'List all guardians for current school' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.guardiansService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guardian details' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.guardiansService.findOne(user.schoolId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new guardian' })
  create(@CurrentUser() user: any, @Body() body: CreateGuardianDto) {
    return this.guardiansService.create(user.schoolId, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update guardian info' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: UpdateGuardianDto) {
    return this.guardiansService.update(user.schoolId, id, body);
  }
}
