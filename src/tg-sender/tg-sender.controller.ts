import { Body, Controller, Get, Post } from '@nestjs/common';
import { TgSenderService } from './tg-sender.service';
import { TokenDto } from './dto/token-validation.dto';

@Controller('tg')
export class TgSenderController {
  constructor(private readonly tgService: TgSenderService) {}

  @Get('/is-valid-token')
  async getTokenData() {
    return this.tgService.checkIsServerTokenValid();
  }

  @Get('/is-valid-chat')
  async getChatData() {
    return this.tgService.checkIsChatAccesible();
  }

  @Post('/is-valid-token')
  async postChatData(@Body() dto: TokenDto) {
    return this.tgService.checkIsTokenValid(dto.value);
  }

  @Post('/is-valid-chat')
  async postTokenData(@Body() dto: TokenDto) {
    return this.tgService.checkIsChatAccesible(dto.value);
  }
}
