import { Module } from '@nestjs/common';
import { NewQuestionsService } from './new-questions.service';
import { NewQuestionsController } from './new-questions.controller';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';
import { WbApiModule } from 'src/wb-api/wb-api.module';

@Module({
  imports: [WbApiModule, TgSenderModule],
  controllers: [NewQuestionsController],
  providers: [NewQuestionsService],
  exports: [NewQuestionsService],
})
export class NewQuestionsModule {}
