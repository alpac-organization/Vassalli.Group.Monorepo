import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPurchaseRequestPayload extends BaseRequest {
   code?: string;
   branch_id?: string;
   request_type?: number;
   area_id?: string,
   status?: number;
   page_size?: number;
   page_number?: number;
}