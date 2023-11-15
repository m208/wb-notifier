import { Controller, Get } from '@nestjs/common';
import { TgSenderService } from './tg-sender.service';

@Controller('tg')
export class TgController {
  constructor(private readonly tgService: TgSenderService) {}

  @Get()
  async getSome() {
    return this.tgService.sendMessage();
  }
}
