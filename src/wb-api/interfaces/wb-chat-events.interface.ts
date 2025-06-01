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
  message?: WBMessage;
  source:
    | 'seller-portal'
    | 'seller-public-api'
    | 'ruSite'
    | 'global'
    | 'ios'
    | 'android';
  addTimestamp: number;
  addTime: string;
  replySign?: string;
  sender: 'client' | 'seller' | 'wb';
  clientID: string;
  clientName: string;
}

type WBMessage = {
  text: string;
};

export interface WBChatMessage {
  isNewChat: boolean;
  clientName: string;
  message: string;
}
