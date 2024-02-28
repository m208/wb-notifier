import { Controller, Get } from '@nestjs/common';
import { NewQuestionsService } from './new-questions.service';

@Controller('new-questions')
export class NewQuestionsController {
  constructor(private readonly newQuestionsService: NewQuestionsService) {}

  @Get()
  async getTokenData() {
    return this.newQuestionsService.requestNewQuestions();
  }
}
