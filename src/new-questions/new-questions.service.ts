import { Injectable } from '@nestjs/common';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import { WbApiService } from 'src/wb-api/wb-api.service';

@Injectable()
export class NewQuestionsService {
  constructor(
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async getNewQuestions() {
    const unansweredQuestions = await this.wbApiService.getQuestionsList({
      isAnswered: false,
      take: 100,
      skip: 0,
    });

    return unansweredQuestions.questions;
  }
}
