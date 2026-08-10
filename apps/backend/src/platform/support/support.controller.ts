import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlatformOnlyGuard } from '../../common/guards/platform-only.guard';
import { Roles } from '../../common/decorators';
import { PlatformRoleEnum } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Platform Support')
@ApiBearerAuth()
@UseGuards(PlatformOnlyGuard)
@Roles(
  PlatformRoleEnum.PLATFORM_OWNER,
  PlatformRoleEnum.PLATFORM_ADMIN,
  PlatformRoleEnum.PLATFORM_SUPPORT,
)
@Controller('platform/support')
export class PlatformSupportController {
  constructor(private prisma: PrismaService) {}

  @Get('tickets')
  findAll() {
    return this.prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('tickets/:id')
  findOne(@Param('id') id: string) {
    return this.prisma.supportTicket.findUnique({
      where: { id },
      include: { messages: true },
    });
  }
}
