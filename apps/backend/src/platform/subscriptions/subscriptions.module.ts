import { Module } from '@nestjs/common';
import { PlatformSubscriptionsController } from './subscriptions.controller';
import { PlatformSubscriptionsService } from './subscriptions.service';

@Module({
  controllers: [PlatformSubscriptionsController],
  providers: [PlatformSubscriptionsService],
})
export class PlatformSubscriptionsModule {}
