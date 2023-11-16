import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NewOrdersTrackerService } from 'src/new-orders-tracker/new-orders-tracker.service';
import { TokenExpiresTrackerService } from 'src/token-expires-tracker/token-expires-tracker.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private readonly trackingService: NewOrdersTrackerService,
    private readonly tokenService: TokenExpiresTrackerService,
  ) {}

  @Cron('0 1 * * * *')
  //  Called every hour, at the start of the 1th minute
  trackOrders() {
    this.trackingService.checkNewOrders();
  }

  @Cron('0 0 10 * * *')
  //  Called every day, at the 10:00
  trackTokenExpiration() {
    this.tokenService.checkToken();
  }
}
