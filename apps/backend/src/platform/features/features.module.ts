import { Module } from '@nestjs/common';
import { PlatformFeaturesController } from './features.controller';
import { PlatformFeaturesService } from './features.service';

@Module({
  controllers: [PlatformFeaturesController],
  providers: [PlatformFeaturesService],
})
export class PlatformFeaturesModule {}
