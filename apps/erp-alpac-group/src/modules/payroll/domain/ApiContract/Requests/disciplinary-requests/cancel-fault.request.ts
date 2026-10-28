import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CancelFaultRequest extends BaseRequest {
  fault_id: string;
}
