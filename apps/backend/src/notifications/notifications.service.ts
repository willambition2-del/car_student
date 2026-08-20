import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PushDeliveryService } from './push-delivery.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private pushDelivery: PushDeliveryService,
  ) {}

  async findAll(schoolId: string, page = 1, limit = 20, search?: string, type?: string) {
    const skip = (page - 1) * limit;
    const where: any = { schoolId };

    if (type && type !== 'ALL') {
      where.type = type as any;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        include: {
          recipients: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      items: items.map((notif) => ({
        id: notif.id,
        title: notif.title,
        body: notif.body,
        recipientGroup: notif.targetRole || 'جميع المستخدمين',
        type: notif.type,
        sentCount: notif.recipients.length || 1,
        status: 'تم الإرسال',
        createdAt: notif.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Central Notification Creation Flow:
   * 1. Validate constraints
   * 2. Save Notification to PostgreSQL
   * 3. Send via Socket (if available, handled separately or via Gateway)
   * 4. Enqueue/Dispatch Self-Hosted Push Notification
   */
  async sendNotification(schoolId: string, data: {
    title: string;
    body: string;
    targetRole?: string;
    type?: any;
    recipientIds?: string[];
    actionType?: string;
    entityType?: string;
    entityId?: string;
  }) {
    // 1. Save Notification
    const notification = await this.prisma.notification.create({
      data: {
        schoolId,
        title: data.title,
        body: data.body,
        targetRole: data.targetRole || 'PARENT',
        type: data.type || 'SYSTEM_ANNOUNCEMENT',
        isGlobal: false,
        actionType: data.actionType,
        entityType: data.entityType,
        entityId: data.entityId,
      },
    });

    if (!data.recipientIds || data.recipientIds.length === 0) {
      // Find all users with this role in the school
      const users = await this.prisma.schoolUser.findMany({
        where: { schoolId, role: data.targetRole as any, isActive: true },
        select: { id: true },
      });
      data.recipientIds = users.map(u => u.id);
    } else {
      // Validate provided recipientIds belong to this school
      const validUsers = await this.prisma.schoolUser.findMany({
        where: { id: { in: data.recipientIds }, schoolId, isActive: true },
        select: { id: true },
      });
      data.recipientIds = validUsers.map(u => u.id);
    }

    // 2. Create Recipients
    if (data.recipientIds.length > 0) {
      await this.prisma.notificationRecipient.createMany({
        data: data.recipientIds.map(userId => ({
          notificationId: notification.id,
          userId,
        })),
        skipDuplicates: true,
      });

      // 3. Dispatch Push Notifications
      this.dispatchPushNotifications(notification.id, data.recipientIds, data);
    }

    return notification;
  }

  private async dispatchPushNotifications(notificationId: string, userIds: string[], data: any) {
    // Find all push devices for these users
    const devices = await this.prisma.pushDevice.findMany({
      where: {
        userId: { in: userIds },
        isActive: true,
      },
    });

    for (const device of devices) {
      const delivered = await this.pushDelivery.sendToEndpoint(device.endpoint, {
        title: data.title,
        message: data.body,
        data: {
          notificationId,
          type: data.type,
          actionType: data.actionType,
          entityId: data.entityId,
        },
      });

      // Log delivery status
      await this.prisma.notificationDelivery.create({
        data: {
          notificationId,
          userId: device.userId,
          deviceId: device.deviceId,
          channel: 'SELF_HOSTED_PUSH',
          status: delivered ? 'DELIVERED' : 'FAILED',
          attempts: 1,
          deliveredAt: delivered ? new Date() : null,
          lastAttemptAt: new Date(),
        },
      });
    }
  }

  async getUnreadForUser(userId: string) {
    const recipients = await this.prisma.notificationRecipient.findMany({
      where: { userId, isRead: false },
      include: { notification: true },
      orderBy: { createdAt: 'desc' },
    });

    return recipients.map((r) => ({
      id: r.notificationId,
      recipientId: r.id,
      title: r.notification.title,
      body: r.notification.body,
      time: this.formatNotificationTime(r.createdAt),
      category: r.notification.type.toString().startsWith('STUDENT_') ? 'رحلات' : 'نظام',
      type: r.notification.type,
      isRead: r.isRead,
      readAt: r.readAt,
      studentId: r.notification.studentId,
      tripId: r.notification.tripId,
      createdAt: r.createdAt,
    }));
  }

  async getForUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [recipients, total] = await Promise.all([
      this.prisma.notificationRecipient.findMany({
        where: { userId },
        include: { notification: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notificationRecipient.count({ where: { userId } }),
    ]);

    return {
      items: recipients.map((r) => ({
        id: r.notificationId,
        recipientId: r.id,
        title: r.notification.title,
        body: r.notification.body,
        time: this.formatNotificationTime(r.createdAt),
        category: r.notification.type.toString().startsWith('STUDENT_') ? 'رحلات' : 'نظام',
        type: r.notification.type,
        isRead: r.isRead,
        readAt: r.readAt,
        studentId: r.notification.studentId,
        tripId: r.notification.tripId,
        createdAt: r.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const recipient = await this.prisma.notificationRecipient.findUnique({
      where: { notificationId_userId: { notificationId, userId } },
    });

    if (!recipient) {
      throw new Error('الإشعار غير موجود أو غير مخصص لك');
    }

    return this.prisma.notificationRecipient.update({
      where: { id: recipient.id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Send notification directly to a student's active guardians
   */
  async notifyStudentGuardians(
    schoolId: string,
    data: {
      studentId: string;
      tripId: string;
      type: any;
      title: string;
      body: string;
      operationId?: string;
      actionType?: string;
      metadata?: any;
    },
  ) {
    // 1. Resolve student and active guardians with app accounts
    const student = await this.prisma.student.findFirst({
      where: { id: data.studentId, schoolId },
      include: {
        guardianLinks: {
          include: {
            guardian: {
              include: {
                schoolUser: true,
              },
            },
          },
        },
      },
    });

    if (!student) return null;

    const recipientUserIds: string[] = [];
    for (const link of student.guardianLinks) {
      if (
        link.guardian &&
        link.guardian.isActive &&
        link.guardian.schoolUserId &&
        link.guardian.schoolUser?.isActive
      ) {
        recipientUserIds.push(link.guardian.schoolUserId);
      }
    }

    if (recipientUserIds.length === 0) {
      return null;
    }

    // 2. Idempotency Check: Prevent duplicate notifications for the same operationId
    if (data.operationId) {
      const existing = await this.prisma.notification.findFirst({
        where: {
          schoolId,
          entityType: 'TRIP_EVENT',
          entityId: data.operationId,
        },
      });
      if (existing) {
        return existing;
      }
    }

    // 3. Persist Notification in PostgreSQL (Source of Truth)
    const notification = await this.prisma.notification.create({
      data: {
        schoolId,
        title: data.title,
        body: data.body,
        targetRole: 'PARENT',
        type: data.type,
        isGlobal: false,
        studentId: data.studentId,
        tripId: data.tripId,
        entityType: 'TRIP_EVENT',
        entityId: data.operationId,
        actionType: data.actionType || data.type,
        data: {
          studentId: data.studentId,
          studentName: student.fullName,
          tripId: data.tripId,
          ...data.metadata,
        },
      },
    });

    // 4. Create Notification Recipients for exact guardians
    await this.prisma.notificationRecipient.createMany({
      data: recipientUserIds.map((userId) => ({
        notificationId: notification.id,
        userId,
        isRead: false,
      })),
      skipDuplicates: true,
    });

    // 5. Dispatch Self-Hosted Push (ntfy / UnifiedPush)
    this.dispatchPushNotifications(notification.id, recipientUserIds, data);

    return notification;
  }

  private formatNotificationTime(date: Date): string {
    try {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  }
}

