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
import { FinancialService } from './financial.service';

@ApiTags('School Financial & Payments')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Roles(
  SchoolRoleEnum.SCHOOL_OWNER,
  SchoolRoleEnum.SCHOOL_ADMIN,
  SchoolRoleEnum.ACCOUNTANT,
)
@Controller('school/financial')
export class FinancialController {
  constructor(private financialService: FinancialService) {}

  @Get('fees')
  @ApiOperation({ summary: 'List all transport fees' })
  findFees(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.financialService.findFees(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
      status,
    );
  }

  @Post('fees')
  @ApiOperation({ summary: 'Create transport fee' })
  createFee(@CurrentUser() user: any, @Body() body: any) {
    return this.financialService.createFee(user.schoolId, body);
  }

  @Post('payments')
  @ApiOperation({ summary: 'Record payment for transport fee' })
  recordPayment(@CurrentUser() user: any, @Body() body: any) {
    return this.financialService.recordPayment(user.schoolId, {
      ...body,
      recordedBy: user.id,
    });
  }

  @Get('receipts')
  @ApiOperation({ summary: 'List all payment receipts' })
  findReceipts(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.financialService.findReceipts(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
    );
  }
}
