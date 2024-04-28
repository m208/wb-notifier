// https://openapi.wb.ru/content/api/ru/#tag/Prosmotr/paths/~1content~1v2~1get~1cards~1list/post

export interface WbAPIContentResponse {
  cards: Array<WBContentDataDTO>;
  cursor: WBContentResponsePaginator;
}

export interface WBContentDataDTO {
  vendorCode: string;
  title: string;
  characteristics: Array<object>;
}

export interface WBContentResponsePaginator {
  updatedAt?: string; // Дата с которой надо запрашивать следующий список КТ
  nmID: number; // Номер Артикула WB с которой надо запрашивтаь следующий список КТ
  total: number; // Кол-во возвращенных КТ
}
