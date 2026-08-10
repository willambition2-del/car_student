import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlatformUsersService } from './platform-users.service';
import { CreatePlatformUserDto } from './dto/create-platform-user.dto';
import { UpdatePlatformUserDto } from './dto/update-platform-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../../common/decorators';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { PlatformRoleEnum } from '../../common/enums';
import { PaginationQuery } from '../../common/types';

@ApiTags('Platform Users')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Controller('platform/users')
export class PlatformUsersController {
  constructor(private readonly platformUsersService: PlatformUsersService) {}

  @Post()
  @Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Create platform user' })
  create(@Body() createDto: CreatePlatformUserDto) {
    return this.platformUsersService.create(createDto);
  }

  @Get()
  @Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'List platform users' })
  findAll(
    @Query() query: PaginationQuery & { role?: string; search?: string },
  ) {
    return this.platformUsersService.findAll(query);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get matrix of platform roles' })
  getRoles() {
    return this.platformUsersService.getRoles();
  }

  @Get(':id')
  @Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Get platform user details' })
  findOne(@Param('id') id: string) {
    return this.platformUsersService.findOne(id);
  }

  @Patch(':id')
  @Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Update platform user' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePlatformUserDto) {
    return this.platformUsersService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Soft delete platform user' })
  remove(@Param('id') id: string) {
    return this.platformUsersService.remove(id);
  }
}
