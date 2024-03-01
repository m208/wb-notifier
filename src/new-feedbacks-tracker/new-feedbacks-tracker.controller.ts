import { Controller, Get } from '@nestjs/common';
import { NewFeedbacksTrackerService } from './new-feedbacks-tracker.service';

@Controller('new-feedbacks')
export class NewFeedbacksTrackerController {
  constructor(
    private readonly newFeedbacksTrackerService: NewFeedbacksTrackerService,
  ) {}

  @Get()
  getFeedbacks() {
    return this.newFeedbacksTrackerService.requestNewFeedbacks();
  }
}
