import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { LayoutTransform3DDto } from "./layout-transform-3d";

export interface RegisterRackLevelCommand {
  width_metres: number;
  length_metres: number;
  usage_profile: string;
  level_number: number;
  max_pulleys: number;
  status: string;
  unavailable_reason?: string | null;
}

export interface RackPlacementCommand {
  code: string;
  layout_transform_3d_dto: LayoutTransform3DDto;
  levels: RegisterRackLevelCommand[];
}

export interface CreateRacksRequest extends BaseRequest {
  section_id: string;
  placements_racks: RackPlacementCommand[];
}
