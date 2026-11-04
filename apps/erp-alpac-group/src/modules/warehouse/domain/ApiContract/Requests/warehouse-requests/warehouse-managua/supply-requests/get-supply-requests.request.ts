import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { ReasonUse } from "@app/core/enums/reason-use.enum";
import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";

export interface GetSupplyRequestsRequest extends BaseRequest {
  code?: string;
  po_code?: string;
  branch_id?: string;
  reason_use?: ReasonUse;
  status?: OutflowStatus;

  page_number: number;
  page_size: number;
}
