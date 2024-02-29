import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NewFeedbacksTrackerService } from 'src/new-feedbacks-tracker/new-feedbacks-tracker.service';
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
    private readonly feedbacksService: NewFeedbacksTrackerService,
  ) {}

  @Cron('0 1 * * * *')
  //  Called every hour, at the start of the 1th minute
  trackOrders() {
    this.trackingService.checkNewOrders();
  }

  // ! Allowed 1 request per second for Feedbacks/questions API !

  @Cron('0 2 * * * *')
  //  Called every hour, at the start of the 2nd minute
  trackQuestions() {
    this.questionsService.checkNewQuestions();
  }

  @Cron('0 3 * * * *')
  //  Called every hour, at the start of the 3rd minute
  trackFeedbacks() {
    this.feedbacksService.checkNewFeedbacks();
  }

  @Cron('0 0 10 * * *')
  //  Called every day, at the 10:00
  trackTokenExpiration() {
    this.tokenService.checkToken();
  }
}
