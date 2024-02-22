import { Controller, Get } from '@nestjs/common';
import { TokenExpiresTrackerService } from './token-expires-tracker.service';

@Controller('token')
export class TokenExpiresTrackerController {
  constructor(private readonly tokenService: TokenExpiresTrackerService) {}

  @Get()
  async getTokenData() {
    return this.tokenService.getTokenExpiresData();
  }
}
