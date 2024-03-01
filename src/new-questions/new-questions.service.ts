import { Injectable, Logger } from '@nestjs/common';
import {
  LINE_DIVIDER_TG,
  NEW_QUESTIONS_COUNT_MESSAGE,
} from 'src/constants/messageText';
import { requestFandQParams } from 'src/new-feedbacks-tracker/new-feedbacks-tracker.service';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import { WBQuestion } from 'src/wb-api/interfaces/wb-questions.interface';
import { WbApiService } from 'src/wb-api/wb-api.service';

@Injectable()
export class NewQuestionsService {
  private readonly logger = new Logger(NewQuestionsService.name);
  private handledQuestions: Array<string> = [];

  constructor(
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async getNewQuestions() {
    const unAnsweredQuestions =
      await this.wbApiService.getQuestionsList(requestFandQParams);

    return unAnsweredQuestions.questions;
  }

  async requestNewQuestions() {
    const questions = await this.getNewQuestions();
    return `${NEW_QUESTIONS_COUNT_MESSAGE} ${questions.length}`;
  }

  async checkNewQuestions() {
    const questions = await this.getNewQuestions();

    if (questions.length > 0) {
      this.handleNewQuestions(questions);
    }
  }

  async handleNewQuestions(questions: Array<WBQuestion>) {
    for await (const question of questions) {
      if (!this.handledQuestions.includes(question.id)) {
        try {
          this.tgSenderService.sendMessage(
            this.generateMessageContent(question),
          );
          this.handledQuestions.push(question.id);
          this.logger.log(
            `Message sent for new question. Product: ${question.productDetails.supplierArticle}`,
          );
        } catch (error) {}
      }
    }
  }

  generateMessageContent(question: WBQuestion, divider = LINE_DIVIDER_TG) {
    const lines = [
      `Новый вопрос от покупателя на Wildberries`,
      `по товару ${question.productDetails.productName} | (${question.productDetails.supplierArticle})`,
      `Вопрос: ${question.text}`,
    ];
    return lines.join(divider);
  }
}
