import { Injectable, Logger } from '@nestjs/common';
import { TgSenderService } from 'src/tg-sender/tg-sender.service';
import {
  WBChatEvent,
  WBChatMessage,
} from 'src/wb-api/interfaces/wb-chat-events.interface';
import { WbApiService } from 'src/wb-api/wb-api.service';

@Injectable()
export class NewChatsService {
  private readonly logger = new Logger(NewChatsService.name);

  // TODO: store this at database
  private lastUsedPaginator: number = Date.now();

  constructor(
    private readonly wbApiService: WbApiService,
    private readonly tgSenderService: TgSenderService,
  ) {}

  async getNewChatMessages() {
    const paginatorSetting = {
      next: this.lastUsedPaginator,
    };

    const chatEvents = await this.wbApiService.getChatEvents(paginatorSetting);
    this.lastUsedPaginator = Date.now();
    return this.handleNewChatMessages(chatEvents);
  }

  handleNewChatMessages(chatEvents: WBChatEvent[]) {
    const clientEvents = chatEvents.filter((el) => el.sender === 'client');
    const clientMessages: WBChatMessage[] = clientEvents.map((el) => ({
      isNewChat: el.isNewChat,
      clientName: el.clientName,
      message: el.message.text,
    }));
    return clientMessages;
  }
}
