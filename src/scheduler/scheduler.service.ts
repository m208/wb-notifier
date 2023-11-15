import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  @Cron('0 1 * * * *')
  handleCron() {
    this.logger.debug('Called every hour, at the start of the 1th minute');
  }
}
