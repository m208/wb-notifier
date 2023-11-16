import { Injectable, Logger } from '@nestjs/common';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import { WBNewOrderDetails } from 'src/wb-api/interfaces/wb-new-order-details.interface';
import { WBOrdersDataDTO } from 'src/wb-api/interfaces/wb-orders-response.interface';
import { WBContentDataDTO } from 'src/wb-api/interfaces/wb-product-response.interface';
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
      this.logger.debug('No new orders');
    } else {
      const ordersData = await this.fillProductNames(orders);
      this.handleNewOrders(ordersData);
    }
  }

  async fillProductNames(
    orders: Array<WBOrdersDataDTO>,
  ): Promise<WBNewOrderDetails[]> {
    const productCodes = orders.map((el) => el.article);
    const productsData =
      await this.wbApiService.getProductContent(productCodes);

    const orderDetails: Array<WBNewOrderDetails> = orders.map((order) => ({
      id: order.id,
      article: order.article,
      price: order.convertedPrice,
      name: this.extractProductName(
        productsData.find((product) => product.vendorCode === order.article),
      ),
    }));

    return orderDetails;
  }

  async handleNewOrders(orders: Array<WBNewOrderDetails>) {
    for await (const order of orders) {
      if (!this.handledOrders.includes(order.id)) {
        try {
          this.tgSenderService.sendMessage(this.generateMessageContent(order));
          this.handledOrders.push(order.id);
          this.logger.debug(`Message sent for ${order.article}`);
        } catch (error) {}
      }
    }
  }

  generateMessageContent(orderDetails: WBNewOrderDetails) {
    const lines = [
      `Новый заказ на Wildberries`,
      `На сумму ${orderDetails.price / 100} руб.`,
      `Состав заказа: ${orderDetails.name}`,
      `Артикул: ${orderDetails.article}`,
    ];
    return lines.join('%0A');
  }

  extractProductName(productData: WBContentDataDTO) {
    if (!productData) return 'not founded';

    const productName: string | undefined = productData.characteristics
      .filter((el) => Object.keys(el).includes('Наименование'))
      .map((el) => Object.values(el))
      .flat()
      .pop();

    return productName || 'not founded';
  }
}
