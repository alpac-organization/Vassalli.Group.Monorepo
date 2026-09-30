import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface PurchaseOrderDocumentRequest extends BaseRequest {
    purchase_order_id: string;
    payment_method?: number;
}
