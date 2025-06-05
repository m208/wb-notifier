import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class TgSenderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly settingsService: SettingsService,
  ) {}

  async sendMessage(message: string) {
    const accessData = await this.settingsService.getTelegramAccessData();
    if (!accessData) return;

    const { data } = await firstValueFrom(
      this.httpService
        .get<unknown>(
          `https://api.telegram.org/bot${accessData['tg-token']}/sendMessage?chat_id=${accessData['tg-chat-id']}&text=${message}`,
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
