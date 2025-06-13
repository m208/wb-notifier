import { Controller, Get } from '@nestjs/common';
import { TokenTrackerService } from './token-tracker.service';

@Controller('token')
export class TokenTrackerController {
  constructor(private readonly tokenService: TokenTrackerService) {}

  @Get()
  async getTokenData() {
    return this.tokenService.getTokenData();
  }
}
