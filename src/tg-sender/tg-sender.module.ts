import { Module } from '@nestjs/common';
import { TgSenderService } from './tg-sender.service';
import { HttpModule } from '@nestjs/axios';
import { TgController } from './tg-sender.controller';

@Module({
  imports: [HttpModule],
  providers: [TgSenderService],
  controllers: [TgController],
})
export class TgSenderModule {}
