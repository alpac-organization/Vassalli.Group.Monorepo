import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { RackUsageProfileValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";

export interface RegisterRacksBulkRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  quantity: number;
  row_number: number;
  level_number: number;
  max_pulleys: number;
  width: number;
  length: number;
  height?: number | null;
  usage_profile: RackUsageProfileValue | number;
  initial_position_x: number;
  initial_position_y: number;
  spacing_x: number;
  rotation_y?: number;
}

