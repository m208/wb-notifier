import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { wbApiLinks } from 'src/constants/apiLinks';
import { WbAPIOrdersResponse } from './interfaces/wb-orders-response.interface';
import { WbAPIContentResponse } from './interfaces/wb-product-response.interface';
import {
  WBQuestionsResponse,
  WBQuestionsResponseData,
} from './interfaces/wb-questions.interface';
import { WBFeedbacksAndQuestionsRequestParams } from './interfaces/wb-feedbacks-and-questions.interface';
import {
  WBFeedbacksResponse,
  WBFeedbacksResponseData,
} from './interfaces/wb-feedbacks.interface';

@Injectable()
export class WbApiService {
  constructor(private readonly httpService: HttpService) {}

  setAuthHeaders() {
    return {
      Authorization: `Bearer ${process.env.WB_API_TOKEN}`,
    };
  }

  async getNewOrders() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WbAPIOrdersResponse>(wbApiLinks.getOrders, {
          headers: this.setAuthHeaders(),
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );
    return data.orders;
  }

  // Допускается максимум 100 запросов в минуту на методы контента в целом.
  async getProductContent(productCodes: Array<string>) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<WbAPIContentResponse>(
          wbApiLinks.getProducts,
          { vendorCodes: productCodes },
          { headers: this.setAuthHeaders() },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );
    return data.data;
  }

  async getFeedbacksOrQuestionsList(
    link: string,
    params: WBFeedbacksAndQuestionsRequestParams,
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WBFeedbacksResponse | WBQuestionsResponse>(link, {
          headers: this.setAuthHeaders(),
          params: params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );

    return data.data;
  }

  async getQuestionsList(params: WBFeedbacksAndQuestionsRequestParams) {
    return (await this.getFeedbacksOrQuestionsList(
      wbApiLinks.getQuestions,
      params,
    )) as WBQuestionsResponseData;
  }

  async getFeedbacksList(params: WBFeedbacksAndQuestionsRequestParams) {
    return (await this.getFeedbacksOrQuestionsList(
      wbApiLinks.getFeedbacks,
      params,
    )) as WBFeedbacksResponseData;
  }
}
