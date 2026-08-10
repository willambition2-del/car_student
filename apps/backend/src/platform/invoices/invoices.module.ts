import { Module } from '@nestjs/common';
import { PlatformInvoicesController } from './invoices.controller';
import { PlatformInvoicesService } from './invoices.service';

@Module({
  controllers: [PlatformInvoicesController],
  providers: [PlatformInvoicesService],
})
export class PlatformInvoicesModule {}
