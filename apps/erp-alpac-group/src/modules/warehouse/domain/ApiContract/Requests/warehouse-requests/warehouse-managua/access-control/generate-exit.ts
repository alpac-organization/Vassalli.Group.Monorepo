import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GenerateExitAccessControlRequest extends BaseRequest  {
  reception_id?: string;
  reception_entrance_id?: string;
  exit_vehicle: boolean;
  exit_container: boolean;
  exit_date?: string;
  exit_time?: string;
}
