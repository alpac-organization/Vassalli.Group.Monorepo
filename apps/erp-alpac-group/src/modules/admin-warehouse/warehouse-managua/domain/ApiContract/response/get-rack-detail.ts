export interface GetRackDetailResponse {
  rack_id: string;
  section_id: string;
  code?: string;
  width_metres?: number;
  length_metres?: number;
  usage_profile?: string;
  row_number: number;
  level_number: number;
  max_pulleys: number;
  status?: string;
  unvailable_reason?: string;
  status_changed_at?: string;
  total_positions: number;
  ocupied_positions: number;
  positions: RackPositionDto[];
}
interface RackPositionDto {
  position_id: string;
  position_number: number;
  position_code: string;
  is_blocked: boolean;
  blocked_reason?: string;
}
