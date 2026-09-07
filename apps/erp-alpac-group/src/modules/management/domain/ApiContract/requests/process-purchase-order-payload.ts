import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface ProcessPurchaseOrderPayload extends BaseRequest {
  requisition_management_review_id: string;
  new_status: number;
  comments?: string;
}