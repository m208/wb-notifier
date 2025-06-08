import { Module } from '@nestjs/common';
import { TgSenderService } from './tg-sender.service';
import { HttpModule } from '@nestjs/axios';
import { SettingsModule } from 'src/settings/settings.module';
import { TgSenderController } from './tg-sender.controller';

@Module({
  imports: [HttpModule, SettingsModule],
  providers: [TgSenderService],
  exports: [TgSenderService],
  controllers: [TgSenderController],
})
export class TgSenderModule {}
