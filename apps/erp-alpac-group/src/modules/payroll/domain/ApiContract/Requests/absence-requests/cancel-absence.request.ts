import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CancelAbsenceRequest extends BaseRequest  {
  absence_id: string;
  cancellation_reason: string;
}
