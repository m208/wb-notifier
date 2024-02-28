import { Injectable } from '@nestjs/common';
import {
  LINE_DIVIDER_TG,
  NEW_QUESTIONS_COUNT_MESSAGE,
  NO_QUESTIONS_MESSAGE,
} from 'src/constants/messageText';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import { WBQuestion } from 'src/wb-api/interfaces/wb-questions.interface';
import { WbApiService } from 'src/wb-api/wb-api.service';

const GET_QUESTIONS_COUNT = 1000;
const GET_QUESTIONS_SKIP_NUM = 0;

@Injectable()
export class NewQuestionsService {
  private handledQuestions: Array<string> = [];

  constructor(
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async getNewQuestions() {
    const unAnsweredQuestions = await this.wbApiService.getQuestionsList({
      isAnswered: false,
      take: GET_QUESTIONS_COUNT,
      skip: GET_QUESTIONS_SKIP_NUM,
    });

    if (unAnsweredQuestions.questions.length === 0) {
      return null;
    } else {
      return unAnsweredQuestions.questions;
    }
  }

  async requestNewQuestions() {
    const questions = await this.getNewQuestions();

    return questions !== null
      ? `${NEW_QUESTIONS_COUNT_MESSAGE} ${questions.length}`
      : NO_QUESTIONS_MESSAGE;
  }

  async checkNewQuestions() {
    const questions = await this.getNewQuestions();

    if (questions !== null) {
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
