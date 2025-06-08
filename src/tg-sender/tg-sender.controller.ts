import { Body, Controller, Post } from '@nestjs/common';
import { TgSenderService } from './tg-sender.service';
import { TokenDto } from './dto/token-validation.dto';

@Controller('tg')
export class TgSenderController {
  constructor(private readonly tgService: TgSenderService) {}

  @Post('/is-valid')
  async getTokenData(@Body() dto: TokenDto) {
    return this.tgService.checkIsTokenValid(dto.token);
  }
}
