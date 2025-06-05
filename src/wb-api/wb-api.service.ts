import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { wbApiLinks } from 'src/constants/apiLinks';
import { WbAPIOrdersResponse } from './interfaces/wb-orders-response.interface';
import {
  WBContentDataDTO,
  WBContentResponsePaginator,
  WbAPIContentResponse,
} from './interfaces/wb-product-response.interface';
import {
  WBQuestionsResponse,
  WBQuestionsResponseData,
} from './interfaces/wb-questions.interface';
import { WBFeedbacksAndQuestionsRequestParams } from './interfaces/wb-feedbacks-and-questions.interface';
import {
  WBFeedbacksResponse,
  WBFeedbacksResponseData,
} from './interfaces/wb-feedbacks.interface';
import {
  PaginatorSettingsParams,
  WBContentSettingsObject,
} from './interfaces/wb-product-request-settings.interface';
import {
  WBClaimsRequestParams,
  WBClaimsResponse,
} from './interfaces/wb-claims.interface';
import {
  WBChatEventsRequestParams,
  WBChatEventsSuccessResponse,
} from './interfaces/wb-chat-events.interface';
import { SettingsService } from 'src/settings/settings.service';

const ALLOWED_NM_LIMIT_PER_REQUEST = 100;

@Injectable()
export class WbApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly settingsService: SettingsService,
  ) {}

  async setAuthHeaders() {
    const accessData = await this.settingsService.getWbAccessData();
    const token = accessData ? accessData.token : '';

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getNewOrders() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WbAPIOrdersResponse>(wbApiLinks.getOrders, {
          headers: await this.setAuthHeaders(),
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
  // https://openapi.wildberries.ru/content/api/ru/#tag/Prosmotr/paths/~1content~1v2~1get~1cards~1list/post
  async getProductsList(settings: WBContentSettingsObject) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<WbAPIContentResponse>(
          wbApiLinks.getProducts,
          { settings },
          { headers: await this.setAuthHeaders() },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );

    return data;
  }

  getRequestSettings({ limit, nmID, updatedAt }: PaginatorSettingsParams) {
    const settings: WBContentSettingsObject = {
      cursor: {
        limit,
        nmID,
      },
      filter: {
        withPhoto: -1,
      },
    };

    if (updatedAt) {
      settings.cursor.updatedAt = updatedAt;
    }

    return settings;
  }

  async getProductsListWithPaginator() {
    const cards: WBContentDataDTO[] = [];

    let paginatorData: WBContentResponsePaginator = {
      nmID: 0,
      total: ALLOWED_NM_LIMIT_PER_REQUEST,
    };

    while (paginatorData.total >= ALLOWED_NM_LIMIT_PER_REQUEST) {
      try {
        const data = await this.getProductsList(
          this.getRequestSettings({
            limit: ALLOWED_NM_LIMIT_PER_REQUEST,
            nmID: paginatorData.nmID,
            updatedAt: paginatorData.updatedAt,
          }),
        );

        cards.push(...data.cards);
        paginatorData = data.cursor;
      } catch (error) {
        break;
      }
    }

    return cards;
  }

  async getProductContent(productCodes: Array<string>) {
    const products = await this.getProductsListWithPaginator();
    return products.filter((el) => productCodes.includes(el.vendorCode));
  }

  async getFeedbacksOrQuestionsList(
    link: string,
    params: WBFeedbacksAndQuestionsRequestParams,
  ) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WBFeedbacksResponse | WBQuestionsResponse>(link, {
          headers: await this.setAuthHeaders(),
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

  async getClaimsList(params: WBClaimsRequestParams) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WBClaimsResponse>(wbApiLinks.getClaims, {
          headers: await this.setAuthHeaders(),
          params: params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );

    return data.claims;
  }

  // !  Maximum of 10 requests per 10 seconds per one seller's account  !
  async getChatEvents(params: WBChatEventsRequestParams) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WBChatEventsSuccessResponse>(wbApiLinks.getChats, {
          headers: await this.setAuthHeaders(),
          params: params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );

    return data.result.events;
  }
}
