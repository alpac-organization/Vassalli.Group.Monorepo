import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { AbsenceStatusEnumMap } from "@app/modules/payroll/domain/enums/absence-enums/absence.enum";
import type { AbsenceSourceEnumMap } from "@app/modules/payroll/domain/enums/absence-enums/absence.enum";

export interface GetAbsencesRequest extends BaseRequest {
  page_number?: number;
  page_size?: number;
  status?: AbsenceStatusEnumMap | number;
  source?: AbsenceSourceEnumMap | number;
  start_date?: string;
  end_date?: string;
  collaborator_id?: string;
  branch_id?: string;
  identification_number?: string;
  payroll_id?: string;
}
