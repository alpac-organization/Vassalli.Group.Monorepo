import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AnnulPurchaseRequestPayload  extends BaseRequest {
   purchase_request_id: string;
   reason: string;
}
