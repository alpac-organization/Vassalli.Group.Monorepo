import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPurchaseRequestProductPayload extends BaseRequest {
   purchase_request_id: string;
   page_number?: number;
   page_size?: number;
}
