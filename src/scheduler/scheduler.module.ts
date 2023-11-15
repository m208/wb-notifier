import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NewOrdersTrackerModule } from 'src/new-orders-tracker/new-orders-tracker.module';

@Module({
  imports: [NewOrdersTrackerModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
