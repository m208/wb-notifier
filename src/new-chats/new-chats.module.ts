import { Module } from '@nestjs/common';
import { NewChatsService } from './new-chats.service';
import { NewChatsController } from './new-chats.controller';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';
import { WbApiModule } from 'src/wb-api/wb-api.module';

@Module({
  imports: [WbApiModule, TgSenderModule],
  controllers: [NewChatsController],
  providers: [NewChatsService],
  exports: [NewChatsService],
})
export class NewChatsModule {}
