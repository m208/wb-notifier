// https://openapi.wildberries.ru/feedbacks-questions/api/ru/#tag/Voprosy/paths/~1api~1v1~1questions/get

import {
  WBFeedbacksAndQuestionsResponse,
  WBFeedbacksAndQuestionsResponseData,
} from './wb-feedbacks-and-questions.interface';
import { WBProductDetails } from './wb-product-details.interface';

export interface WBQuestionsResponse extends WBFeedbacksAndQuestionsResponse {
  data: WBQuestionsResponseData;
}

export interface WBQuestionsResponseData
  extends WBFeedbacksAndQuestionsResponseData {
  questions: Array<WBQuestion>;
}

export interface WBQuestion {
  id: string;
  text: string;
  productDetails: WBProductDetails;
}
