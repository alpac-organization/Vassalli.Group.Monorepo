import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface PurchaseOrderRequestSummary {
  purchase_request_id: string;
  code: string | null;
  request_date: string;
  revision_date: string | null;
  priority_level: PriorityLevelType;
  destination: PurchaseRequestDestinationType;
  request_type: PurchaseRequestType;
  request_status: PurchaseRequestStatusType;
  is_accounting_approved: boolean;
  is_management_approved: boolean;
  is_purchase_order_generated: boolean;
}

export interface GetPurchaseOrdersResponse {
  purchase_order_id: string;
  purchase_order_code: string | null;
  payment_request_code: string | null;
  supplier_id: string | null;
  supplier_name: string | null;
  comments: string | null;
  sent_to_review_at: string;
  sent_by_user_information: UserInformation;
  purchase_request: PurchaseOrderRequestSummary;
}

export type GetPurchaseOrdersResponseList =
  PaginateBaseResponse<GetPurchaseOrdersResponse>;
