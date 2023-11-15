import { Injectable, Logger } from '@nestjs/common';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import { WBNewOrderDetails } from 'src/wb-api/interfaces/wb-new-order-details.interface';
import { WBOrdersDataDTO } from 'src/wb-api/interfaces/wb-orders-response.interface';
import { WbApiService } from 'src/wb-api/wb-api.service';

@Injectable()
export class NewOrdersTrackerService {
  private readonly logger = new Logger(NewOrdersTrackerService.name);
  private handledOrders: Array<number> = [];
  constructor(
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async checkNewOrders() {
    const orders = await this.wbApiService.getNewOrders();
    if (orders.length === 0) {
      this.logger.log('No new orders');
    } else this.handleNewOrders(orders);
  }

  async handleNewOrders(orders: Array<WBOrdersDataDTO>) {
    for await (const order of orders) {
      if (!this.handledOrders.includes(order.id)) {
        const orderDetails = await this.combineOrderDetails(order);

        try {
          this.tgSenderService.sendMessage(orderDetails);
          this.handledOrders.push(order.id);
        } catch (error) {}
      }
    }
  }

  async combineOrderDetails(
    order: WBOrdersDataDTO,
  ): Promise<WBNewOrderDetails> {
    return {
      article: order.article,
      price: order.price,
      name: await this.wbApiService.getProductTitle(order.article),
    };
  }
}
