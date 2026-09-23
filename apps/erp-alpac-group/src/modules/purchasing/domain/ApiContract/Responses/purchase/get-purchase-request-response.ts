import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface GetPurchaseRequestResponse {
  code: string | null;
  purchase_request_id: string;
  request_date: string;
  revision_date: string | null;
  priority_level: PriorityLevelType;
  destination: PurchaseRequestDestinationType;
  request_type: PurchaseRequestType;
  request_status: PurchaseRequestStatusType;
}

export type GetPurchaseRequestResponseList = PaginateBaseResponse<GetPurchaseRequestResponse[]>;
