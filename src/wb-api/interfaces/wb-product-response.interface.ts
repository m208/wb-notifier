// https://openapi.wb.ru/content/api/ru/#tag/Prosmotr/paths/~1content~1v2~1get~1cards~1list/post

export interface WbAPIContentResponse {
  cards: Array<WBContentDataDTO>;
}

export interface WBContentDataDTO {
  vendorCode: string;
  title: string;
  characteristics: Array<object>;
}
