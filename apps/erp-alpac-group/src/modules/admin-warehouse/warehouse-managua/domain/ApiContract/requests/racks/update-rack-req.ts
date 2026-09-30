import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { RackUsageProfileValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import type { RackStatusValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";

export interface UpdateRackRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  rack_id: string;
  row_number?: number | null;
  usage_profile?: RackUsageProfileValue | number | null;
  status?: RackStatusValue | number | null;
  unavailable_reason?: string | null;
  width?: number | null;
  length?: number | null;
  height?: number | null;
  position_x?: number | null;
  position_y?: number | null;
  position_z?: number | null;
  rotation_y?: number | null;
}
