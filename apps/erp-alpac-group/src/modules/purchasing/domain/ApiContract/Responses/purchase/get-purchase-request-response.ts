import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
export interface GetPurchaseRequestResponse {
  code: string;
  purchase_request_id: string;
  request_date: string;
  request_status: string;
  request_type: string;
  revision_date: string;
  destination: PurchaseRequestDestinationType;
  priority_level: PriorityLevelType;
}

export interface GetPurchaseRequestResponseList {
  data: GetPurchaseRequestResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
