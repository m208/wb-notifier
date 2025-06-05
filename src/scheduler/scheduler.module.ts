import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NewOrdersTrackerModule } from 'src/new-orders-tracker/new-orders-tracker.module';
import { TokenExpiresTrackerModule } from 'src/token-expires-tracker/token-expires-tracker.module';
import { NewQuestionsModule } from 'src/new-questions/new-questions.module';
import { NewFeedbacksTrackerModule } from 'src/new-feedbacks-tracker/new-feedbacks-tracker.module';
import { NewClaimsTrackerModule } from 'src/new-claims-tracker/new-claims-tracker.module';
import { NewChatsModule } from 'src/new-chats/new-chats.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [
    NewOrdersTrackerModule,
    TokenExpiresTrackerModule,
    NewQuestionsModule,
    NewFeedbacksTrackerModule,
    NewClaimsTrackerModule,
    NewChatsModule,
    SettingsModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
