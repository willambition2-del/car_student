import { Module } from '@nestjs/common';
import { PlatformAuditController } from './audit.controller';

@Module({
  controllers: [PlatformAuditController]
})
export class PlatformAuditModule {}
