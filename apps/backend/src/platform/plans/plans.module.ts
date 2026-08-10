import { Module } from '@nestjs/common';
import { PlatformPlansController } from './plans.controller';
import { PlatformPlansService } from './plans.service';

@Module({
  controllers: [PlatformPlansController],
  providers: [PlatformPlansService],
})
export class PlatformPlansModule {}
