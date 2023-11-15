import { Controller, Get } from '@nestjs/common';
import { NewOrdersTrackerService } from './new-orders-tracker.service';

@Controller('new-orders-tracker')
export class NewOrdersTrackerController {
  constructor(
    private readonly newOrdersTrackerService: NewOrdersTrackerService,
  ) {}

  @Get()
  async getSome() {
    return this.newOrdersTrackerService.checkNewOrders();
  }
}
