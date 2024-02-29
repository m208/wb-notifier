// https://openapi.wildberries.ru/feedbacks-questions/api/ru/#tag/Otzyvy/paths/~1api~1v1~1feedbacks/get

import { WBFeedbacksAndQuestionsResponse } from './wb-feedbacks-and-questions.interface';
import { WBProductDetails } from './wb-product-details.interface';

export interface WBFeedbacksResponse extends WBFeedbacksAndQuestionsResponse {
  data: WBFeedbacksResponseData;
}

export interface WBFeedbacksResponseData {
  countUnanswered: number;
  countArchive: number;
  feedbacks: Array<WBFeedback>;
}

export interface WBFeedback {
  id: string;
  text: string;
  productValuation: number;
  productDetails: WBProductDetails;
}
