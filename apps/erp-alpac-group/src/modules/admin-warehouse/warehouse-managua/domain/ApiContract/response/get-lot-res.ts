export interface LotListItemResponse {
  lot_id: string;
  code: string | null;
  width_metres: number;
  length_metres: number;
  status: string | number | null;
}

export interface GetLotsResponse {
  data: LotListItemResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
