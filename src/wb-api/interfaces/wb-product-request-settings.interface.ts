// https://openapi.wb.ru/content/api/ru/#tag/Prosmotr/paths/~1content~1v2~1get~1cards~1list/post
export interface WBContentSettingsObject {
  filter: {
    withPhoto: number;
  };
  cursor: PaginatorSettingsParams;
}

export type PaginatorSettingsParams = {
  limit: number;
  updatedAt?: string;
  nmID: number;
};
