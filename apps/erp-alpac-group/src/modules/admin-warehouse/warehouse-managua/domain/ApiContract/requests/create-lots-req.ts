import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { LayoutTransform3DDto } from "./layout-transform-3d";

export interface LotPlacementCommand {
  code: string;
  width_metres: number;
  length_metres: number;
  nominal_rows: number;
  nominal_columns: number;
  allows_stacking: boolean;
  status: string;
  layout_transform_3d_dto?: LayoutTransform3DDto | null;
  unavailable_reason?: string | null;
}

export interface CreateLotsRequest extends BaseRequest {
  section_id: string;
  placements_lots: LotPlacementCommand[];
}
