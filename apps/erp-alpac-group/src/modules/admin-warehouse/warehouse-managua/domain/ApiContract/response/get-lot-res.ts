export interface LotListItemResponse {
  lot_id: string;
  code: string;
  width_metres: number;
  length_metres: number;
  status: string | null;
  total_positions: number;
  occupied_positions: number;
}

export interface LotPositionResponse {
  position_id: string;
  row_number: number;
  column_number: number;
  position_code: string;
  allows_stacking: boolean;
  is_blocked: boolean;
}

export interface LotDetailResponse {
  lot_id: string;
  section_id: string;
  code: string;
  width_metres: number;
  length_metres: number;
  nominal_rows: number;
  nominal_columns: number;
  allows_stacking: boolean;
  status: string | null;
  unavailable_reason: string | null;
  status_changed_at: string | null;
  total_positions: number;
  occupied_positions: number;
  positions: LotPositionResponse[];
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
