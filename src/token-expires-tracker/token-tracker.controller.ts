import { Body, Controller, Get, Post } from '@nestjs/common';
import { TokenTrackerService } from './token-tracker.service';
import { TokenDto } from 'src/tg-sender/dto/token-validation.dto';

@Controller('token')
export class TokenTrackerController {
  constructor(private readonly tokenService: TokenTrackerService) {}

  @Get()
  async getTokenData() {
    return this.tokenService.getTokenData();
  }

  @Post()
  async postTokenData(@Body() dto: TokenDto) {
    return this.tokenService.getTokenData(dto.value);
  }

  @Get('/expires')
  async getTokenExpirationData() {
    return this.tokenService.getTokenExpirationData();
  }
}
