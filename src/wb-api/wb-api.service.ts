import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { wbApiLinks } from 'src/constants/apiLinks';
import {
  WBOrdersDataDTO,
  WbAPIOrdersResponse,
} from './interfaces/wb-orders-response.interface';
import { WBNewOrderDetails } from './interfaces/wb-new-order-details.interface';
import { WbAPIContentResponse } from './interfaces/wb-product-response.interface';

@Injectable()
export class WbApiService {
  private readonly logger = new Logger(WbApiService.name);
  private handledOrders: Array<number> = [];
  constructor(private readonly httpService: HttpService) {}

  setAuthHeaders() {
    return {
      Authorization: `Bearer ${process.env.WB_API_TOKEN}`,
    };
  }

  async checkNewOrders() {
    const orders = await this.getNewOrders();
    if (orders.length === 0) return;
    else this.handleNewOrders(orders);
  }

  async getNewOrders() {
    const { data } = await firstValueFrom(
      this.httpService
        .get<WbAPIOrdersResponse>(wbApiLinks.getOrders, {
          headers: this.setAuthHeaders(),
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data.data;
  }

  async handleNewOrders(orders: Array<WBOrdersDataDTO>) {
    for await (const order of orders) {
      if (!this.handledOrders.includes(order.id)) {
        const orderDetails = await this.combineOrderDetails(order);
        // send message
        this.handledOrders.push(order.id);
      }
    }
  }

  async combineOrderDetails(
    order: WBOrdersDataDTO,
  ): Promise<WBNewOrderDetails> {
    return {
      article: order.article,
      price: order.price,
      name: await this.getProductTitle(order.article),
    };
  }

  async getProductTitle(productCode: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<WbAPIContentResponse>(
          wbApiLinks.getProducts,
          { vendorCodes: [productCode] },
          { headers: this.setAuthHeaders() },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );

    const productName: string | undefined = data.data[0].characteristics
      .filter((el) => Object.keys(el).includes('Наименование'))
      .map((el) => Object.values(el))
      .flat()
      .pop();

    return productName;
  }
}
