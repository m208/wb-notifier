import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LINE_DIVIDER_TG } from 'src/constants/messageText';
import { SettingsService } from 'src/settings/settings.service';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import { WbApiService } from 'src/wb-api/wb-api.service';

const DAYS_BEFORE_WARN = 30;

@Injectable()
export class TokenTrackerService {
  constructor(
    private jwtService: JwtService,
    private readonly tgSenderService: TgSenderService,
    private readonly settingsService: SettingsService,
    private readonly wbApiService: WbApiService,
  ) {}

  async getTokenExpiringDate(token?: string) {
    let effectiveToken = token;

    if (!effectiveToken) {
      const accessData = await this.settingsService.getWbAccessData();
      effectiveToken = accessData ? accessData.token : '';
    }

    const decodedToken = this.jwtService.decode(effectiveToken);

    return decodedToken ? new Date(decodedToken.exp * 1000) : new Date(0);
  }

  async checkToken() {
    const expiringDate = await this.getTokenExpiringDate();

    const timeLeft = expiringDate.getTime() - new Date().getTime();
    const daysLeft = timeLeft / (1000 * 60 * 60 * 24);

    if (daysLeft < DAYS_BEFORE_WARN) {
      this.tgSenderService.sendMessage(
        this.generateMessageContent(expiringDate),
      );
    }
  }

  generateMessageContent(expiringDate: Date) {
    const lines = [
      `Необходимо обновить токен API Wildberries`,
      `Токен действителен до ${expiringDate.toLocaleDateString('ru-RU')}`,
    ];
    return lines.join(LINE_DIVIDER_TG);
  }

  async getTokenExpirationData() {
    const expiringDate = (await this.getTokenExpiringDate()).toLocaleDateString(
      'ru-RU',
    );
    return `Токен действителен до ${expiringDate}`;
  }

  async getTokenData(token?: string) {
    const expiringDate = await this.getTokenExpiringDate(token);

    if (new Date() < new Date(expiringDate)) {
      const tokenMethods = await this.wbApiService.getTokenMethods(token);

      return {
        ...tokenMethods,
        expires: expiringDate,
      };
    }

    return {
      expires: expiringDate,
    };
  }
}
