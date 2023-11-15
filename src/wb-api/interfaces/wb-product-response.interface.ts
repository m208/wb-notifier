// https://openapi.wb.ru/content/api/ru/#tag/Prosmotr/paths/~1content~1v1~1cards~1filter/post

export interface WbAPIContentResponse {
  data: Array<WBContentDataDTO>;
}

export interface WBContentDataDTO {
  vendorCode: string;
  characteristics: Array<object>;
}
