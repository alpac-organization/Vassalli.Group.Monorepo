import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { RackUsageProfileValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import type { RackStatusValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
export interface GetRacksRequest extends BaseRequest {
  section_id: string;
  level_number: number | null;
  usage_profile: RackUsageProfileValue | null;
  status: RackStatusValue | null;
  page_number: number;
  page_size: number;
}
