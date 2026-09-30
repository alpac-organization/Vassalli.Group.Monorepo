import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { RackUsageProfileValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import type { RackStatusValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";

export interface GetRacksRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  code?: string | null;
  row_number?: number | null;
  level_number?: number | null;
  status?: RackStatusValue | number | null;
  usage_profile?: RackUsageProfileValue | number | null;
  page_number?: number;
  page_size?: number;
}
