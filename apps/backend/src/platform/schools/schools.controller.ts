import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PlatformSchoolsService } from './schools.service';
import { CurrentUser, Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';
import { PaginationQuery } from '../../common/types';

@ApiTags('Platform Schools')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
@Controller('platform/schools')
export class PlatformSchoolsController {
  constructor(private readonly schoolsService: PlatformSchoolsService) {}

  @Get()
  @ApiOperation({ summary: 'List schools' })
  findAll(
    @Query() query: PaginationQuery & { status?: string; search?: string },
  ) {
    return this.schoolsService.findAll(query);
  }

  @Post('provision')
  @ApiOperation({ summary: 'Provision new school & initial setup' })
  create(@Body() createDto: any, @CurrentUser() user: any) {
    return this.schoolsService.create(createDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school details' })
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update school details' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.schoolsService.update(id, updateDto);
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend school' })
  suspend(@Param('id') id: string) {
    return this.schoolsService.suspend(id);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate school' })
  activate(@Param('id') id: string) {
    return this.schoolsService.activate(id);
  }

  @Post(':id/support-session')
  @ApiOperation({ summary: 'Generate support session for school' })
  supportSession(@Param('id') id: string, @CurrentUser() user: any) {
    return this.schoolsService.createSupportSession(id, user.id);
  }
}
