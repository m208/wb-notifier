import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError, of } from 'rxjs';
import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class TgSenderService {
  private readonly logger = new Logger(TgSenderService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly settingsService: SettingsService,
  ) {}

  async sendMessage(message: string) {
    const accessData = await this.settingsService.getTelegramAccessData();
    if (!accessData) return;

    const url = `https://api.telegram.org/bot${accessData['tg-token']}/sendMessage?chat_id=${accessData['tg-chat-id']}&text=${message}`;

    const data = await firstValueFrom(
      this.httpService.get<unknown>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error('Telegram API error:', {
            status: error.response?.status,
            description: error.message,
          });
          return of(null);
        }),
      ),
    );

    return data;
  }

  async checkIsTokenValid(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.telegram.org/bot${token}/getMe`),
      );
      return {
        isValid: true,
        username: response.data.result.username,
      };
    } catch (error) {
      return { isValid: false };
    }
  }

  async checkIsServerTokenValid() {
    const accessData = await this.settingsService.getTelegramAccessData();
    if (!accessData) return { isValid: false };

    return this.checkIsTokenValid(accessData['tg-token']);
  }
}
