import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SchoolContextGuard } from '../common/guards/school-context.guard';
import { CurrentUser, Roles, Public } from '../common/decorators';
import { SchoolRoleEnum } from '../common/enums';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('School Notifications')
@ApiBearerAuth()
@UseGuards(SchoolContextGuard)
@Controller('school/notifications')
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
    SchoolRoleEnum.SUPERVISOR,
  )
  @ApiOperation({ summary: 'List all sent notifications (Admin view)' })
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.notificationsService.findAll(
      user.schoolId,
      Number(page) || 1,
      Number(limit) || 20,
      search,
      type,
    );
  }

  @Post('send')
  @Roles(
    SchoolRoleEnum.SCHOOL_OWNER,
    SchoolRoleEnum.SCHOOL_ADMIN,
    SchoolRoleEnum.TRANSPORT_MANAGER,
  )
  @ApiOperation({ summary: 'Send broadcast notification' })
  sendNotification(@CurrentUser() user: any, @Body() body: any) {
    return this.notificationsService.sendNotification(user.schoolId, body);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread notifications for current user' })
  getUnread(@CurrentUser() user: any) {
    return this.notificationsService.getUnreadForUser(user.sub); // JWT sub is userId
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.sub);
  }

  @Post('register-device')
  @ApiOperation({ summary: 'Register a device for self-hosted push notifications' })
  async registerDevice(@CurrentUser() user: any, @Body() body: { endpoint: string, deviceId?: string, platform?: string, pushProvider?: string }) {
    if (!body.endpoint) {
      throw new Error('Endpoint is required');
    }
    
    return this.prisma.pushDevice.upsert({
      where: {
        userId_endpoint: {
          userId: user.sub,
          endpoint: body.endpoint,
        }
      },
      update: {
        lastSeenAt: new Date(),
        isActive: true,
        deviceId: body.deviceId,
      },
      create: {
        schoolId: user.schoolId,
        userId: user.sub,
        endpoint: body.endpoint,
        deviceId: body.deviceId,
        platform: body.platform,
        pushProvider: body.pushProvider || 'UNIFIED_PUSH',
      }
    });
  }
}
