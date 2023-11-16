// https://openapi.wb.ru/marketplace/api/ru/#tag/Sborochnye-zadaniya/paths/~1api~1v3~1orders~1new/get

export interface WbAPIOrdersResponse {
  orders: Array<WBOrdersDataDTO>;
}

export interface WBOrdersDataDTO {
  id: number; // Идентификатор сборочного задания в Маркетплейсе
  createdAt: string; // Дата создания сборочного задания
  warehouseId: number; // Идентификатор склада продавца, на который поступило сборочное задание
  convertedPrice: number; // Цена в валюте продажи с учетом всех скидок, сконвертированная по курсу
  article: string; // Артикул продавца
}
