import { Module } from '@nestjs/common';
import { TokenExpiresTrackerService } from './token-expires-tracker.service';
import { JwtModule } from '@nestjs/jwt';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';
import { TokenExpiresTrackerController } from './token-expires-tracker.controller';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [JwtModule, TgSenderModule, SettingsModule],
  providers: [TokenExpiresTrackerService],
  exports: [TokenExpiresTrackerService],
  controllers: [TokenExpiresTrackerController],
})
export class TokenExpiresTrackerModule {}
