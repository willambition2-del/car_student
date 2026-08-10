import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PushDeliveryService } from './push-delivery.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, PushDeliveryService],
  exports: [NotificationsService, PushDeliveryService],
})
export class NotificationsModule {}
