import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface RackDto {
  rack_id: string;
  code: string;
  section_id: string;
  row_number: number;
  level_number: number;
  max_pulleys: number;
  status: string;
  usage_profile: string;
  width: number;
  length: number;
  height: number;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
  total_positions: number;
  occupied_positions: number;
  available_positions: number;
}

export type GetRacksResponse = PaginateBaseResponse<RackDto[]>;
