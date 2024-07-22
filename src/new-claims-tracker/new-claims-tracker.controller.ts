import { Controller, Get } from '@nestjs/common';
import { NewClaimsTrackerService } from './new-claims-tracker.service';

@Controller('new-claims-tracker')
export class NewClaimsTrackerController {
  constructor(
    private readonly newClaimsTrackerService: NewClaimsTrackerService,
  ) {}

  @Get()
  async getOrders() {
    return this.newClaimsTrackerService.requestNewClaims();
  }
}
