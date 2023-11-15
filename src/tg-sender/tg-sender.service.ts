import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { TelegramResponseDTO } from './interfaces/tg-response.interface';
import { WBNewOrderDetails } from 'src/wb-api/interfaces/wb-new-order-details.interface';

@Injectable()
export class TgSenderService {
  constructor(private readonly httpService: HttpService) {}

  generateMessageContent(orderDetails: WBNewOrderDetails) {
    const lines = [
      `Новый заказ на Wildberries`,
      `На сумму ${orderDetails.price / 100} руб.`,
      `Состав заказа: ${orderDetails.name}, артикул: ${orderDetails.article}`,
    ];
    return lines.join('%0A');
  }

  async sendMessage(orderDetails: WBNewOrderDetails) {
    const message = this.generateMessageContent(orderDetails);

    const { data } = await firstValueFrom(
      this.httpService
        .get<TelegramResponseDTO>(
          `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage?chat_id=${process.env.TG_USER_ID}&text=${message}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );

    return data;
  }
}
