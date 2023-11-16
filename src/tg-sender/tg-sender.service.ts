import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class TgSenderService {
  constructor(private readonly httpService: HttpService) {}

  async sendMessage(message: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<unknown>(
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
