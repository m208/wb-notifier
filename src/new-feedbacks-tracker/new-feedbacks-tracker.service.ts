import { Injectable, Logger } from '@nestjs/common';
import {
  LINE_DIVIDER_TG,
  NEW_FEEDBACKS_COUNT_MESSAGE,
} from 'src/constants/messageText';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import { WBFeedbacksAndQuestionsRequestParams } from 'src/wb-api/interfaces/wb-feedbacks-and-questions.interface';
import { WBFeedback } from 'src/wb-api/interfaces/wb-feedbacks.interface';
import { WbApiService } from 'src/wb-api/wb-api.service';

const GET_FEEDBACKS_COUNT = 1000;
const GET_FEEDBACKS_SKIP_NUM = 0;

export const requestFandQParams: WBFeedbacksAndQuestionsRequestParams = {
  isAnswered: false,
  take: GET_FEEDBACKS_COUNT,
  skip: GET_FEEDBACKS_SKIP_NUM,
};

@Injectable()
export class NewFeedbacksTrackerService {
  private readonly logger = new Logger(NewFeedbacksTrackerService.name);
  private handledFeedbacks: Array<string> = [];

  constructor(
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async getNewFeedbacks() {
    const unAnsweredFeedbacks =
      await this.wbApiService.getFeedbacksList(requestFandQParams);

    return unAnsweredFeedbacks.feedbacks;
  }

  async requestNewFeedbacks() {
    const feedbacks = await this.getNewFeedbacks();
    return `${NEW_FEEDBACKS_COUNT_MESSAGE} ${feedbacks.length}`;
  }

  async checkNewFeedbacks() {
    const feedbacks = await this.getNewFeedbacks();

    if (feedbacks.length > 0) {
      this.handleNewFeedbacks(feedbacks);
    }
  }

  async handleNewFeedbacks(feedbacks: Array<WBFeedback>) {
    for await (const feedback of feedbacks) {
      if (!this.handledFeedbacks.includes(feedback.id)) {
        try {
          this.tgSenderService.sendMessage(
            this.generateMessageContent(feedback),
          );
          this.handledFeedbacks.push(feedback.id);
          this.logger.log(
            `Message sent for new feedback. Product: ${feedback.productDetails.supplierArticle}`,
          );
        } catch (error) {}
      }
    }
  }

  generateMessageContent(feedback: WBFeedback, divider = LINE_DIVIDER_TG) {
    const lines = [
      `Новый отзыв на Wildberries`,
      `${feedback.productDetails.productName} | (${feedback.productDetails.supplierArticle})`,
      `Оценка: ${`\u2B50 `.repeat(feedback.productValuation)}`,
      `${feedback.cons ? `Недостатки: ${feedback.cons}` : ''}`,
      `${feedback.pros ? `Достоинства: ${feedback.pros}` : ''}`,
      `${feedback.text ? `Комментарий: ${feedback.text}` : ''}`,
      `${feedback.photoLinks ? `Приложено фото` : ''}`,
    ];
    return lines.filter((el) => !!el).join(divider);
  }
}
