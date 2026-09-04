import type { LayoutTransform3DDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/layout-transform-3d";

export interface LotListItemResponse {
  lot_id: string;
  code: string | null;
  width_metres: number;
  length_metres: number;
  status: string | number | null;
  total_positions: number;
  occupied_positions: number;
  transform?: LayoutTransform3DDto | null;
}

export interface GetLotsResponse {
  data: LotListItemResponse[];
  page_number: number;
  page_size: number;
  total: number;
}

export interface LotSummaryResponse {
  lot_id: string;
  code: string;
  positions_count: number;
}
