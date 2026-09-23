import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface GetPurchaseOrdersResponse {
   comments: string | null;
   sent_to_review_at: string;
   purchase_order_id: string;
   sent_by_user_information: UserInformation;
   purchase_request: GetPurchaseRequestDetailResponse;
}

export type GetPurchaseOrdersResponseList = PaginateBaseResponse<GetPurchaseOrdersResponse[]>;
