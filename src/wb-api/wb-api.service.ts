import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { wbApiLinks } from 'src/constants/apiLinks';
import { WbAPIOrdersResponse } from './interfaces/wb-orders-response.interface';
import { WbAPIContentResponse } from './interfaces/wb-product-response.interface';
import { WBQuestionsResponse } from './interfaces/wb-questions.interface';
import { WBFeedbacksAndQuestionsRequestParams } from './interfaces/wb-feedbacks-and-questions.interface';
import { WBFeedbacksResponse } from './interfaces/wb-feedbacks.interface';

@Injectable()
export class WbApiService {
  private readonly logger = new Logger(WbApiService.name);
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

  async getQuestionsList(params: WBFeedbacksAndQuestionsRequestParams) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WBQuestionsResponse>(wbApiLinks.getQuestions, {
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

  async getFeedbacksList(params: WBFeedbacksAndQuestionsRequestParams) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WBFeedbacksResponse>(wbApiLinks.getFeedbacks, {
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
}
