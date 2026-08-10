import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { TripsGateway } from './trips.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TripsController],
  providers: [TripsService, TripsGateway, JwtService],
  exports: [TripsService],
})
export class TripsModule {}
