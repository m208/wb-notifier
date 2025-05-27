import { Module } from '@nestjs/common';
import { NewChatsService } from './new-chats.service';
import { NewChatsController } from './new-chats.controller';

@Module({
  controllers: [NewChatsController],
  providers: [NewChatsService],
})
export class NewChatsModule {}
