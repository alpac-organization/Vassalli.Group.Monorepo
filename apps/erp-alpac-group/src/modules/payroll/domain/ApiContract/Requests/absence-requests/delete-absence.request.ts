import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface DeleteAbsenceRequest extends BaseRequest  {
  absence_id: string;
}
