import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PurchaseRequest } from "./get-purchase-orders-response";

export interface GetPurchaseOrderDetailsResponse {
   reviewer_user_information: UserInformation,
   purchase_request_details: PurchaseRequest
}