import { Module } from '@nestjs/common';
import { AddressRequestsController } from './address-requests.controller';
import { AddressRequestsService } from './address-requests.service';

@Module({
  controllers: [AddressRequestsController],
  providers: [AddressRequestsService],
  exports: [AddressRequestsService],
})
export class AddressRequestsModule {}
