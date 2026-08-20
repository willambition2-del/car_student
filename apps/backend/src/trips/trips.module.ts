import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { TripsGateway } from './trips.gateway';
import { JwtService } from '@nestjs/jwt';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [TripsController],
  providers: [TripsService, TripsGateway, JwtService],
  exports: [TripsService],
})
export class TripsModule {}
