import type { RackStatusValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import type { LayoutTransform3DDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/layout-transform-3d";

export interface RackListItemResponse {
  rack_id: string;
  code: string;
  level_number: number;
  row_number: number;
  status: RackStatusValue;
  total_positions: string;
  occupied_positions: number;
  positions: Positions[];
  width_metres?: number | null;
  length_metres?: number | null;
  transform?: LayoutTransform3DDto | null;
}

export interface Positions {
  position_id: string;
  position_number: number;
  position_code: string;
  is_blocked: boolean;
  block_reason?: string | null;
  is_occupied: boolean;
}

export interface GetRackResponse {
  data: RackListItemResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
