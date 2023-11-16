import { Module } from '@nestjs/common';
import { TgSenderService } from './tg-sender.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TgSenderService],
  exports: [TgSenderService],
})
export class TgSenderModule {}
