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

  async checkIsChatValid(token: string, chat: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.telegram.org/bot${token}/getChat?chat_id=${chat}`,
        ),
      );

      const chatData = response.data.result;
      let displayName: string | null = null;

      if (chatData.username) {
        displayName = chatData.username;
      } else if (chatData.type === 'private') {
        const first = chatData.first_name || '';
        const last = chatData.last_name || '';
        displayName = `${first} ${last}`.trim() || null;
      } else if (chatData.title) {
        displayName = chatData.title;
      }
      return {
        isValid: true,
        type: chatData.type, // private | group | supergroup | channel
        displayName, // username | full name | title
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

  async checkIsChatAccesible(chatId?: string) {
    const accessData = await this.settingsService.getTelegramAccessData();

    if (!accessData) return { isValid: false };

    let checkChatId = chatId;
    if (!checkChatId) {
      checkChatId = accessData['tg-chat-id'];
    }

    return this.checkIsChatValid(accessData['tg-token'], checkChatId);
  }
}
