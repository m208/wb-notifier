import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LINE_DIVIDER_TG } from 'src/constants/messageText';
import { SettingsService } from 'src/settings/settings.service';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';

const DAYS_BEFORE_WARN = 30;

@Injectable()
export class TokenTrackerService {
  constructor(
    private jwtService: JwtService,
    private readonly tgSenderService: TgSenderService,
    private readonly settingsService: SettingsService,
  ) {}

  async getTokenExpiringDate() {
    const accessData = await this.settingsService.getWbAccessData();
    const token = accessData ? accessData.token : '';

    const decodedToken = this.jwtService.decode(token);

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

  async getTokenData() {
    const expiringDate = (await this.getTokenExpiringDate()).toLocaleDateString(
      'ru-RU',
    );
    return `Токен действителен до ${expiringDate}`;
  }
}
