// https://openapi.wildberries.ru/feedbacks-questions/api/ru/#tag/Otzyvy/paths/~1api~1v1~1feedbacks/get

import {
  WBFeedbacksAndQuestionsResponse,
  WBFeedbacksAndQuestionsResponseData,
} from './wb-feedbacks-and-questions.interface';
import { WBQuestion } from './wb-questions.interface';

export interface WBFeedbacksResponse extends WBFeedbacksAndQuestionsResponse {
  data: WBFeedbacksResponseData;
}

export interface WBFeedbacksResponseData
  extends WBFeedbacksAndQuestionsResponseData {
  feedbacks: Array<WBFeedback>;
}

export interface WBFeedback extends WBQuestion {
  productValuation: number;
}
