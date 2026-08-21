export interface LotListItemResponse {
  lot_id: string;
  code: string;
  width_metres: number;
  length_metres: number;
  status: string | null;
  total_positions: number;
  occupied_positions: number;
}

export interface LotSummaryResponse {
  lot_id: string;
  code: string;
  positions_count: number;
}

export interface RegisterLotsResultResponse {
  section_id: string;
  total_requested: number;
  total_created: number;
  lots: LotSummaryResponse[];
}
