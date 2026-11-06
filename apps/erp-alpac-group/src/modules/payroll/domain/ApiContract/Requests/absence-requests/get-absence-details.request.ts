import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetAbsenceDetailsRequest extends BaseRequest  {
  absence_id: string;
}
