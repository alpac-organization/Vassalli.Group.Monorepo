import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";

export interface GetPurchaseOrderDetailsResponse extends GetPurchaseOrdersResponse {
   reviewer_user_information: UserInformation;
   purchase_request_details: GetPurchaseRequestDetailResponse;
}
