import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface SendToUnloadingRequest extends BaseRequest {
  operational_order_id: string;
  assignment_id: string;
}
