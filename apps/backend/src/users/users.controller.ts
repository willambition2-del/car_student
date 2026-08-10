import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser, Roles, Permissions, CurrentSchool } from '../common/decorators';
import { SchoolContextGuard } from '../common/guards/school-context.guard';
import { SchoolRoleEnum } from '../common/enums';
import { PaginationQuery } from '../common/types';

@ApiTags('School Users')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Controller('school/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(SchoolRoleEnum.SCHOOL_OWNER, SchoolRoleEnum.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Create a new school user' })
  create(
    @CurrentUser() user: any,
    @CurrentSchool() schoolId: string,
    @Body() createUserDto: CreateUserDto
  ) {
    // ALWAYS inject schoolId from authenticated context (Tenant Isolation)
    return this.usersService.create(schoolId, createUserDto, user.id);
  }

  @Get()
  @Roles(SchoolRoleEnum.SCHOOL_OWNER, SchoolRoleEnum.SCHOOL_ADMIN, SchoolRoleEnum.TRANSPORT_MANAGER)
  @ApiOperation({ summary: 'List school users' })
  findAll(
    @CurrentSchool() schoolId: string,
    @Query() query: PaginationQuery & { role?: string, search?: string }
  ) {
    return this.usersService.findAll(schoolId, query);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get matrix of school roles' })
  getRoles() {
    return this.usersService.getRoles();
  }

  @Get(':id')
  @Roles(SchoolRoleEnum.SCHOOL_OWNER, SchoolRoleEnum.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Get user details' })
  findOne(
    @CurrentSchool() schoolId: string,
    @Param('id') id: string
  ) {
    return this.usersService.findOne(schoolId, id);
  }

  @Patch(':id')
  @Roles(SchoolRoleEnum.SCHOOL_OWNER, SchoolRoleEnum.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Update user' })
  update(
    @CurrentSchool() schoolId: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(schoolId, id, updateUserDto);
  }

  @Delete(':id')
  @Roles(SchoolRoleEnum.SCHOOL_OWNER, SchoolRoleEnum.SCHOOL_ADMIN)
  @ApiOperation({ summary: 'Soft delete user' })
  remove(
    @CurrentSchool() schoolId: string,
    @Param('id') id: string
  ) {
    return this.usersService.remove(schoolId, id);
  }
}
