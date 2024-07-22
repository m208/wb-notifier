// https://openapi.wildberries.ru/returns/api/ru/

export interface WBClaimsRequestParams {
  is_archive: boolean;
  id?: string;
  limit?: number;
  offset?: number;
  nm_id?: number;
}

export interface WBClaimsResponse {
  claims: WBClaimDTO[];
  total: number;
}

export interface WBClaimDTO {
  id: string;
  claim_type: number;
  status: number;
  status_ex: number;
  nm_id: number;
  user_comment: string;
  wb_comment: string;
  dt: string;
  imt_name: string;
  order_dt: string;
  dt_update: string;
  photos: string[];
  video_paths: string[];
  actions: string[];
}
