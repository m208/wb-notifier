// https://dev.wildberries.ru/en/openapi/user-communication#tag/Buyers-Chat/paths/~1api~1v1~1seller~1events/get

export interface WBChatEventsRequestParams {
  next: number; //  Paginator. Retrieve the next data packet starting from this moment. Format: Unix timestamp with milliseconds
}

export interface WBChatEventsSuccessResponse {
  result: {
    next: number;
    newestEventTime: string;
    oldestEventTime: string;
    totalEvents: number;
    events: Array<WBChatEvent>;
  };
  errors: string[] | null;
}

export interface WBChatEvent {
  chatID: string;
  eventID: string;
  eventType: 'message' | 'refund';
  isNewChat: boolean;
  message: WBMessage;
  source: string;
  addTimestamp: number;
  addTime: string;
  replySign?: string;
  sender: 'client' | 'seller' | 'wb';
  clientID: string;
  clientName: string;
}

type WBMessage = {
  attachments?: {
    goodCard?: WBMessageAttachedCard;
    images?: Array<WBMessageAttachedImages>;
  };
  text?: string;
};

type WBMessageAttachedCard = {
  date: string;
  needRefund: boolean;
  nmID: number;
  price: number;
  priceCurrency: string;
  rid: string;
  size: string;
  statusID: number;
};

type WBMessageAttachedImages = {
  date: string;
  url: string;
};

export interface WBChatMessage {
  chatId: string;
  isNewChat: boolean;
  clientName: string;
  productId: number | null;
  photoAttached: boolean;
  messages: string[];
}
