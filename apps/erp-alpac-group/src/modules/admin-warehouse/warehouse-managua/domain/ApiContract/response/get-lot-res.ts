export interface LotListItemResponse {
  id: string;
  code: string | null;
  status: string | number | null;
  allows_stacking: boolean;
  unavailable_reason: string | null;
  status_changed_at: string | null;
}

export interface GetLotsResponse {
  data: LotListItemResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
