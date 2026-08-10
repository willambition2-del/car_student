import { Module } from '@nestjs/common';
import { PlatformSchoolsController } from './schools.controller';
import { PlatformSchoolsService } from './schools.service';

@Module({
  controllers: [PlatformSchoolsController],
  providers: [PlatformSchoolsService],
})
export class PlatformSchoolsModule {}
