import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { wbApiLinks } from 'src/constants/apiLinks';
import {
  WBOrdersDataDTO,
  WbAPIOrdersResponse,
} from './interfaces/wb-orders-response.interface';

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
        // send message
        this.handledOrders.push(order.id);
      }
    }
  }
}
