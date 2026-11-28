import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CancelTerminationRequest extends BaseRequest {
  termination_id: string;
  cancellation_reason: string;
}
