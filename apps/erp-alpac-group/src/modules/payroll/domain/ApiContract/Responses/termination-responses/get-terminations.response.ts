import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { TerminationStatusEnumMap } from "@app/modules/payroll/domain/enums/termination-enums/termination-status.enum";
import type { TerminationTypeEnumMap } from "@app/modules/payroll/domain/enums/termination-enums/termination-type.enum";

export interface TerminationDto {
  termination_id: string;
  collaborator_id: string;
  collaborator_name: string;
  identification_number?: string | null;
  sanction_id?: string | null;
  termination_type: TerminationTypeEnumMap;
  termination_status: TerminationStatusEnumMap;
  reason: string;
  departure_date?: string | null;
  notice_date?: string | null;
  notice_days?: number | null;
  created_at: string;
}

export type GetTerminationsResponse = PaginateBaseResponse<TerminationDto>;

export interface TerminationEvidenceDto {
  file_name?: string | null;
  content_type?: string | null;
  image_url?: string | null;
}

export interface TerminationUserDto {
  user_id: string;
  full_name?: string | null;
  email?: string | null;
  status?: string | null;
}

export interface TerminationDetailDto extends TerminationDto {
  cancellation_reason?: string | null;
  registered_by: string;
  registered_by_user?: TerminationUserDto | null;
  closed_by?: string | null;
  closed_by_user?: TerminationUserDto | null;
  closed_at?: string | null;
  evidences: TerminationEvidenceDto[];
}
