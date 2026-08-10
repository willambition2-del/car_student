import { Module } from '@nestjs/common';
import { AbsenceRequestsController } from './absence-requests.controller';
import { AbsenceRequestsService } from './absence-requests.service';

@Module({
  controllers: [AbsenceRequestsController],
  providers: [AbsenceRequestsService],
  exports: [AbsenceRequestsService],
})
export class AbsenceRequestsModule {}
