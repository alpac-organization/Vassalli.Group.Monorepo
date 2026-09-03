import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PurchaseRequest } from "./get-purchase-orders-response";

export interface GetPurchaseOrderDetailsResponse {
   comments: string;
   sent_to_review_at: string;
   purchase_order_id: string;
   sent_by_user_information: UserInformation;
   reviewer_user_information: UserInformation;
   purchase_request_details: PurchaseRequest;
   purchase_request: PurchaseRequest;
}