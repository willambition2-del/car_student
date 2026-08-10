import { Module } from '@nestjs/common';
import { PlatformSupportController } from './support.controller';

@Module({
  controllers: [PlatformSupportController]
})
export class PlatformSupportModule {}
