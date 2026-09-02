import type {
   BranchInformation,
   UserInformation,
   WorkAreaInformation,
} from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface GetPurchaseOrdersResponse {
   comments: string;
   sent_to_review_at: string;
   purchase_order_id: string;
   sent_by_user_information: UserInformation;
   purchase_request: PurchaseRequest;
}

export type GetPurchaseOrdersResponseList = PaginateBaseResponse<GetPurchaseOrdersResponse[]>;

export interface PurchaseRequest {
   observations: string;
   reason_rejection: string;
   branch_information: BranchInformation;
   creator_user_information: UserInformation;
   reviewer_user_information: UserInformation;
   work_area_information: WorkAreaInformation;
}
