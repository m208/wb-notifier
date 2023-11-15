import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NewOrdersTrackerService } from 'src/new-orders-tracker/new-orders-tracker.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(private readonly trackingService: NewOrdersTrackerService) {}

  @Cron('0 1 * * * *')
  handleCron() {
    this.logger.debug('Called every hour, at the start of the 1th minute');
    this.trackingService.checkNewOrders();
  }
}
