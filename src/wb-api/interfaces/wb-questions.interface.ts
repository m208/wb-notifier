// https://openapi.wildberries.ru/feedbacks-questions/api/ru/#tag/Voprosy/paths/~1api~1v1~1questions/get

import { WBProductDetails } from './wb-product-details.interface';

export interface WBQuestionsRequestParams {
  isAnswered: boolean;
  take: number;
  skip: number;
}

export interface WBQuestionsResponse {
  data: WBQuestionsResponseData;
  error: boolean;
  errorText: string;
  additionalErrors: null | Array<string>;
}

export interface WBQuestionsResponseData {
  countUnanswered: number;
  countArchive: number;
  questions: Array<WBQuestion>;
}

export interface WBQuestion {
  id: string;
  text: string;
  productDetails: WBProductDetails;
}
