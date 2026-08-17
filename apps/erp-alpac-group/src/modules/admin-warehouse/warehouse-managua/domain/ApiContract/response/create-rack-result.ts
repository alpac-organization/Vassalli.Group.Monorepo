import type { RackUsageProfileValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import type { RackStatusValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
export interface CreateRackResultResponse {
  shelf_code?: string;
  starting_deposit_number?: number;
  levels: RackLevelSpecResult[];
}
export interface RackLevelSpecResult {
  level_number: number;
  racks_count: number;
  width_metres: number;
  length_metres: number;
  height_metres?: number;
  usage_profile: RackUsageProfileValue;
  max_pulleys: number;
  status: RackStatusValue;
  unvailable_reason?: string;
}
