import { Module } from '@nestjs/common';
import { TgSenderService } from './tg-sender.service';
import { HttpModule } from '@nestjs/axios';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [HttpModule, SettingsModule],
  providers: [TgSenderService],
  exports: [TgSenderService],
})
export class TgSenderModule {}
