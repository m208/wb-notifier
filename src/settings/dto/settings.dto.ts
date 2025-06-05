import { IsBoolean } from 'class-validator';

export class SettingsDto {
  @IsBoolean()
  trackNewOrders: boolean;

  @IsBoolean()
  trackNewFeedbacks: boolean;

  @IsBoolean()
  trackNewQuestions: boolean;

  @IsBoolean()
  trackNewClaims: boolean;

  @IsBoolean()
  trackNewChatMessages: boolean;

  @IsBoolean()
  trackTokenExpiration: boolean;
}
