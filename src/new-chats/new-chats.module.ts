import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewChatsService } from './new-chats.service';
import { NewChatsController } from './new-chats.controller';
import { TgSenderModule } from 'src/tg-sender/tg-sender.module';
import { WbApiModule } from 'src/wb-api/wb-api.module';
import { NextMessageCursor } from 'src/entities/next-message-cursor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NextMessageCursor]),
    WbApiModule,
    TgSenderModule,
  ],
  controllers: [NewChatsController],
  providers: [NewChatsService],
  exports: [NewChatsService],
})
export class NewChatsModule {}
