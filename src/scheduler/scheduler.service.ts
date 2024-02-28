import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NewOrdersTrackerService } from 'src/new-orders-tracker/new-orders-tracker.service';
import { NewQuestionsService } from 'src/new-questions/new-questions.service';
import { TokenExpiresTrackerService } from 'src/token-expires-tracker/token-expires-tracker.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private readonly trackingService: NewOrdersTrackerService,
    private readonly tokenService: TokenExpiresTrackerService,
    private readonly questionsService: NewQuestionsService,
  ) {}

  @Cron('0 1 * * * *')
  //  Called every hour, at the start of the 1th minute
  trackOrders() {
    this.trackingService.checkNewOrders();
  }

  @Cron('0 2 * * * *')
  //  Called every hour, at the start of the 2nd minute
  trackQuestions() {
    this.questionsService.checkNewQuestions();
  }

  @Cron('0 0 10 * * *')
  //  Called every day, at the 10:00
  trackTokenExpiration() {
    this.tokenService.checkToken();
  }
}
