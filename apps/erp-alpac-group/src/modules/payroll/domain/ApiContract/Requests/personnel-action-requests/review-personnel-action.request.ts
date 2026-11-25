import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface ReviewPersonnelActionRequest extends BaseRequest {
  request_id: string;
  is_approved: boolean;
  management_notes?: string | null;
}
