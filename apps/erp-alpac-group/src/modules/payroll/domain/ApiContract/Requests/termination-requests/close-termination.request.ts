import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CloseTerminationRequest extends BaseRequest {
  termination_id: string;
  departure_date?: string | null;
}
