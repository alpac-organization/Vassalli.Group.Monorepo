import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PaginateBaseRequest } from "@app/shared/interfaces/paginate-base/paginate-base-request";

export interface GetPurchaseOrdersPayload extends BaseRequest, PaginateBaseRequest {
   area_id?: string;
   branch_id?: string;
}