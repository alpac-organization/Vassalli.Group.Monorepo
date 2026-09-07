import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPurchaseOrderDetailsPayload extends BaseRequest {
   purchase_order_id: string;  
}