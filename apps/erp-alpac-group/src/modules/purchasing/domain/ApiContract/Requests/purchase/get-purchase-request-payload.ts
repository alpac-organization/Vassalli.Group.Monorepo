import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPurchaseRequestPayload extends BaseRequest {
   code?: string;
   year?: number;
   month?: number;
   branch_id?: string;
   area_id?: string;
   request_type?: number;
   priority_level?: number;
   destination?: number;
   status?: number;
   page_number?: number;
   page_size?: number;
}
