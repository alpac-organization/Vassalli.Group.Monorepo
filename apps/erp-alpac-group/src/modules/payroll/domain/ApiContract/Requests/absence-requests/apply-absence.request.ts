import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface ApplyAbsenceRequest extends BaseRequest {
  absence_id: string;
  fault_catalog_id?: string | null;
}
