import { Module } from '@nestjs/common';
import { PlatformHealthController } from './health.controller';

@Module({
  controllers: [PlatformHealthController]
})
export class PlatformHealthModule {}
