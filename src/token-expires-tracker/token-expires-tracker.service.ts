import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';

const DAYS_BEFORE_WARN = 30;

@Injectable()
export class TokenExpiresTrackerService {
  constructor(
    private jwtService: JwtService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  checkToken() {
    const decodedJwtAccessToken = this.jwtService.decode(
      process.env.WB_API_TOKEN,
    );

    const expiringDate = new Date(decodedJwtAccessToken.exp * 1000);
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
    return lines.join('%0A');
  }
}
