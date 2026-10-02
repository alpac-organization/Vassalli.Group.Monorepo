export interface LotDto {
  id: string;
  code: string | null;
  status: string | number | null;
  allows_stacking: boolean;
  unavailable_reason: string | null;
  status_changed_at: string | null;
  width: number;
  length: number;
  area: number;
  position_x: number | null;
  position_y: number | null;
  position_z: number | null;
  rotation_y: number | null;
}

export interface GetLotsResponse {
	data: LotDto[];
	page_number: number;
	page_size: number;
	total: number;
}
