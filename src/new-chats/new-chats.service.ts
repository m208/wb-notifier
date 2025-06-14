import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LINE_DIVIDER_TG, NEW_CHATS_MESSAGE } from 'src/constants/messageText';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import {
  WBChatEvent,
  WBChatEventsRequestParams,
  WBChatMessage,
} from 'src/wb-api/interfaces/wb-chat-events.interface';
import { WbApiService } from 'src/wb-api/wb-api.service';
import { NextMessageCursor } from 'src/entities/next-message-cursor.entity';

@Injectable()
export class NewChatsService {
  private readonly logger = new Logger(NewChatsService.name);

  constructor(
    @InjectRepository(NextMessageCursor)
    private readonly cursorRepo: Repository<NextMessageCursor>,
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async getCursor() {
    const cursor = await this.cursorRepo.findOneBy({ id: 1 });
    return cursor.nextMessageCursor || Date.now();
  }

  async updateCursor() {
    await this.cursorRepo.save({ id: 1, nextMessageCursor: Date.now() });
  }

  async requestChatMessages() {
    const messages = await this.getNewChatMessages();
    return `${NEW_CHATS_MESSAGE} ${messages.length}`;
  }

  async checkNewChatMessages() {
    const newMessages = await this.getNewChatMessages();
    return this.handleNewChatMessages(newMessages);
  }

  async getNewChatMessages() {
    const paginatorSetting: WBChatEventsRequestParams = {
      next: await this.getCursor(),
    };

    const chatEvents = await this.wbApiService.getChatEvents(paginatorSetting);
    await this.updateCursor();

    return this.collectNewChatMessages(chatEvents);
  }

  collectNewChatMessages(chatEvents: WBChatEvent[]) {
    const clientEvents = chatEvents.filter((el) => el.sender === 'client');

    const groupedMessages: Record<string, WBChatMessage> = {};

    for (const event of clientEvents) {
      if (!groupedMessages[event.chatID]) {
        groupedMessages[event.chatID] = {
          chatId: event.chatID,
          isNewChat: event.isNewChat,
          clientName: event.clientName,
          productId:
            event.message.attachments && event.message.attachments.goodCard
              ? event.message.attachments.goodCard.nmID
              : null,
          photoAttached: false,
          messages: [],
        };
      }

      if (event.message.text) {
        groupedMessages[event.chatID].messages.push(event.message.text);
      }

      if (event.message.attachments && event.message.attachments.images) {
        groupedMessages[event.chatID].photoAttached = true;
      }
    }

    return Object.values(groupedMessages);
  }

  async handleNewChatMessages(messages: WBChatMessage[]) {
    for await (const message of messages) {
      try {
        this.tgSenderService.sendMessage(this.generateMessageContent(message));
        this.logger.log(`Message sent for a new chat message`);
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  generateMessageContent(message: WBChatMessage, divider = LINE_DIVIDER_TG) {
    const lines = [
      `📄 Новое сообщение от покупателя ${
        message.clientName || ''
      } на Wildberries`,
      `${
        message.isNewChat
          ? `🆕  Это новое обращение. ${
              message.productId ? `Артикул WB: ${message.productId}` : ''
            }`
          : '🔁 Это продолжение диалога.'
      }`,
      ``,
      `${message.messages.join(divider)}`,
      `${message.photoAttached ? '🖼️ Приложено изображение' : ''}`,
    ];

    return lines.join(divider);
  }
}
