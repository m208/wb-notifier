import { Body, Controller, Get, Post } from '@nestjs/common';
import { TgSenderService } from './tg-sender.service';
import { TokenDto } from './dto/token-validation.dto';

@Controller('tg')
export class TgSenderController {
  constructor(private readonly tgService: TgSenderService) {}

  @Get('/is-valid')
  async getTokenData() {
    return this.tgService.checkIsServerTokenValid();
  }

  @Post('/is-valid')
  async postTokenData(@Body() dto: TokenDto) {
    return this.tgService.checkIsTokenValid(dto.token);
  }
}
