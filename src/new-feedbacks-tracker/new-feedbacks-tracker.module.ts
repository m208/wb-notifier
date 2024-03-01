import { Module } from '@nestjs/common';
import { NewFeedbacksTrackerService } from './new-feedbacks-tracker.service';
import { NewFeedbacksTrackerController } from './new-feedbacks-tracker.controller';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';
import { WbApiModule } from 'src/wb-api/wb-api.module';

@Module({
  imports: [WbApiModule, TgSenderModule],
  controllers: [NewFeedbacksTrackerController],
  providers: [NewFeedbacksTrackerService],
  exports: [NewFeedbacksTrackerService],
})
export class NewFeedbacksTrackerModule {}
