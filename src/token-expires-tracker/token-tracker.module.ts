import { Module } from '@nestjs/common';
import { TokenTrackerService } from './token-tracker.service';
import { JwtModule } from '@nestjs/jwt';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';
import { TokenTrackerController } from './token-tracker.controller';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [JwtModule, TgSenderModule, SettingsModule],
  providers: [TokenTrackerService],
  exports: [TokenTrackerService],
  controllers: [TokenTrackerController],
})
export class TokenTrackerModule {}
