import { Controller, Get } from '@nestjs/common';
import { NewChatsService } from './new-chats.service';

@Controller('new-chats')
export class NewChatsController {
  constructor(private readonly newChatsService: NewChatsService) {}

  @Get()
  GetNewChatMessages() {
    return this.newChatsService.getNewChatMessages();
  }
}
