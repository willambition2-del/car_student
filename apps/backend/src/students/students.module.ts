import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { ProximityService } from './proximity.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, ProximityService],
  exports: [StudentsService, ProximityService],
})
export class StudentsModule {}
