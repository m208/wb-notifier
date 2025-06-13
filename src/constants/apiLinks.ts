export const wbApiLinks = {
  getOrders: `https://marketplace-api.wildberries.ru/api/v3/orders/new`,
  getProducts: `https://content-api.wildberries.ru/content/v2/get/cards/list`,
  getQuestions: `https://feedbacks-api.wildberries.ru/api/v1/questions`,
  getFeedbacks: `https://feedbacks-api.wildberries.ru/api/v1/feedbacks`,
  getClaims: `https://returns-api.wildberries.ru/api/v1/claims`,
  getChats: `https://buyer-chat-api.wildberries.ru/api/v1/seller/events`,
};

export const wbConnectionCheckList = [
  {
    category: 'content',
    url: `https://content-api.wildberries.ru/ping`,
  },
  {
    category: 'marketplace',
    url: `https://marketplace-api.wildberries.ru/ping`,
  },
  {
    category: 'feedbacks',
    url: `https://feedbacks-api.wildberries.ru/ping`,
  },
  {
    category: 'returns',
    url: `https://returns-api.wildberries.ru/ping`,
  },
  {
    category: 'chat',
    url: `https://buyer-chat-api.wildberries.ru/ping`,
  },
];
