import { Module } from '@nestjs/common';
import { SupervisorsController } from './supervisors.controller';
import { SupervisorsService } from './supervisors.service';

@Module({
  controllers: [SupervisorsController],
  providers: [SupervisorsService],
  exports: [SupervisorsService],
})
export class SupervisorsModule {}
