import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolContextGuard } from '../common/guards/school-context.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { SchoolRoleEnum } from '../common/enums';
import { AddressRequestsService } from './address-requests.service';

@ApiTags('School Address Requests')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.TRANSPORT_MANAGER,
  SchoolRoleEnum.PARENT,
)
@Controller('school/address-requests')
export class AddressRequestsController {
  constructor(private addressRequestsService: AddressRequestsService) {}

  @Get()
  @ApiOperation({ summary: 'List all address change requests' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.addressRequestsService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      status,
      user,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address change request details' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addressRequestsService.findOne(user.schoolId, id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create new address change request' })
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.addressRequestsService.create(user.schoolId, body, user);
  }

  @Post(':id/approve')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
  )
  @ApiOperation({
    summary: 'Approve address change request and update student location',
  })
  approve(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.addressRequestsService.approve(user.schoolId, id, notes);
  }

  @Post(':id/reject')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
  )
  @ApiOperation({ summary: 'Reject address change request' })
  reject(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.addressRequestsService.reject(user.schoolId, id, reason);
  }
}
