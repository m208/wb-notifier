import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LINE_DIVIDER_TG } from 'src/constants/messageText';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';

const DAYS_BEFORE_WARN = 30;

@Injectable()
export class TokenExpiresTrackerService {
  constructor(
    private jwtService: JwtService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  getTokenExpiringDate() {
    const token = this.jwtService.decode(process.env.WB_API_TOKEN);
    return new Date(token.exp * 1000);
  }

  checkToken() {
    const expiringDate = this.getTokenExpiringDate();
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

  getTokenExpiresData() {
    return `Токен действителен до 
             ${this.getTokenExpiringDate().toLocaleDateString('ru-RU')}`;
  }
}
