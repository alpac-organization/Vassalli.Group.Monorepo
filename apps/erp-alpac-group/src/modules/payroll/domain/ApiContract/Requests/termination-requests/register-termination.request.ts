import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { TerminationTypeEnumMap } from "@app/modules/payroll/domain/enums/termination-enums/termination-type.enum";

export interface TerminationEvidenceInput {
  file_name?: string;
  image_base64?: string;
  content_type?: string;
}

export interface RegisterTerminationRequest extends BaseRequest {
  collaborator_id: string;
  termination_type: TerminationTypeEnumMap;
  reason: string;
  notice_date?: string | null;
  notice_days?: number | null;
  sanction_id?: string | null;
  evidences?: TerminationEvidenceInput[];
}
