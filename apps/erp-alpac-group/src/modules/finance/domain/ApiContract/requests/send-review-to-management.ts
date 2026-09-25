import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface SendReviewToManagementRequest extends BaseRequest {
  purchase_requests_reviewed_accounting_id: string;
  comments?: string | null;
  is_approved: boolean;
}
