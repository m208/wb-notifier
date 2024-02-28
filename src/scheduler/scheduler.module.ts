import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NewOrdersTrackerModule } from 'src/new-orders-tracker/new-orders-tracker.module';
import { TokenExpiresTrackerModule } from 'src/token-expires-tracker/token-expires-tracker.module';
import { NewQuestionsModule } from 'src/new-questions/new-questions.module';

@Module({
  imports: [
    NewOrdersTrackerModule,
    TokenExpiresTrackerModule,
    NewQuestionsModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
