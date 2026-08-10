import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Platform Audit')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(PlatformRoleEnum.PLATFORM_OWNER, PlatformRoleEnum.PLATFORM_ADMIN)
@Controller('platform/audit')
export class PlatformAuditController {
  constructor(private prisma: PrismaService) {}

  @Get('logs')
  findAll() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Get('logs/:id')
  findOne(@Param('id') id: string) {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }
}
