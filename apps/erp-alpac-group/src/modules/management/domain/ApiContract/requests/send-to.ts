import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface SendToRequest extends BaseRequest {
  requisition_management_review_id: string;
}
