import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { LayoutTransform3DDto } from "./layout-transform-3d";

export interface RackPlacementCommand {
  code: string;
  width_metres: number;
  length_metres: number;
  height_metres: number;
  usage_profile: string;
  row_number: number;
  level_number: number;
  max_pulleys: number;
  status: string;
  layout_transform_3d_dto?: LayoutTransform3DDto | null;
  unavailable_reason?: string | null;
}

export interface CreateRacksRequest extends BaseRequest {
  section_id: string;
  placement_racks: RackPlacementCommand[];
}
