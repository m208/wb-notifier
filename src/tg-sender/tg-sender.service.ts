import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { TelegramResponseDTO } from './interfaces/tg-response.interface';

@Injectable()
export class TgSenderService {
  private readonly logger = new Logger(TgSenderService.name);
  constructor(private readonly httpService: HttpService) {}

  async sendMessage() {
    const message = `Hello!`;
    const { data } = await firstValueFrom(
      this.httpService
        .get<TelegramResponseDTO>(
          `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage?chat_id=${process.env.TG_USER_I}&text=${message}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );

    return data.ok;
  }
}
