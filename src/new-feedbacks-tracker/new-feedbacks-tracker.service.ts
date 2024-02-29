import { Injectable } from '@nestjs/common';
import {
  LINE_DIVIDER_TG,
  NEW_FEEDBACKS_COUNT_MESSAGE,
  NO_FEEDBACKS_MESSAGE,
} from 'src/constants/messageText';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import { WBFeedback } from 'src/wb-api/interfaces/wb-feedbacks.interface';
import { WbApiService } from 'src/wb-api/wb-api.service';

const GET_FEEDBACKS_COUNT = 1000;
const GET_FEEDBACKS_SKIP_NUM = 0;

@Injectable()
export class NewFeedbacksTrackerService {
  private handledFeedbacks: Array<string> = [];

  constructor(
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async getNewFeedbacks() {
    const unAnsweredFeedbacks = await this.wbApiService.getFeedbacksList({
      isAnswered: false,
      take: GET_FEEDBACKS_COUNT,
      skip: GET_FEEDBACKS_SKIP_NUM,
    });

    if (unAnsweredFeedbacks.feedbacks.length === 0) {
      return null;
    } else {
      return unAnsweredFeedbacks.feedbacks;
    }
  }

  async requestNewFeedbacks() {
    const feedbacks = await this.getNewFeedbacks();

    return feedbacks !== null
      ? `${NEW_FEEDBACKS_COUNT_MESSAGE} ${feedbacks.length}`
      : NO_FEEDBACKS_MESSAGE;
  }

  async checkNewFeedbacks() {
    const feedbacks = await this.getNewFeedbacks();

    if (feedbacks !== null) {
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
        } catch (error) {}
      }
    }
  }

  generateMessageContent(feedback: WBFeedback, divider = LINE_DIVIDER_TG) {
    const lines = [
      `Новый отзыв на Wildberries`,
      `${feedback.productDetails.productName} | (${feedback.productDetails.supplierArticle})`,
      `Оценка: ${`\u2B50 `.repeat(feedback.productValuation)}`,
      `${feedback.text}`,
    ];
    return lines.join(divider);
  }
}
