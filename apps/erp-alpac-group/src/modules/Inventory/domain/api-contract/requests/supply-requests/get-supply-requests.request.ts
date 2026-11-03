import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { ReasonUse } from "@app/core/enums/reason-use.enum";

export interface GetSupplyRequestsRequest extends BaseRequest {
  code?: string;
  work_area_id?: string;
  cost_center_id?: string;
  branch_id?: string;
  warehouse_id?: string;
  operational_order_id?: string;
  requested_by_user_id?: string;
  reason_use?: ReasonUse;

  page_number: number;
  page_size: number;
}
