import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WbApiModule } from './wb-api/wb-api.module';
import { ConfigModule } from '@nestjs/config';
import { TgSenderModule } from './tg-sender/tg-sender.module';
import { NewOrdersTrackerModule } from './new-orders-tracker/new-orders-tracker.module';
import { TokenExpiresTrackerModule } from './token-expires-tracker/token-expires-tracker.module';
import { NewQuestionsModule } from './new-questions/new-questions.module';
import { NewFeedbacksTrackerModule } from './new-feedbacks-tracker/new-feedbacks-tracker.module';
import { NewClaimsTrackerModule } from './new-claims-tracker/new-claims-tracker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    SchedulerModule,
    WbApiModule,
    TgSenderModule,
    NewOrdersTrackerModule,
    TokenExpiresTrackerModule,
    NewQuestionsModule,
    NewFeedbacksTrackerModule,
    NewClaimsTrackerModule,
  ],
  providers: [AppService],
})
export class AppModule {}
