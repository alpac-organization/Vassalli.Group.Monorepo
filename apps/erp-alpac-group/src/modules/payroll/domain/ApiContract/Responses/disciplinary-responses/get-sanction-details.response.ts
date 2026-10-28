import type { DisciplinaryEvidenceResponse } from "./disciplinary-evidence.response";
import type { DisciplinaryUserResponse } from "./disciplinary-user.response";
import type { FaultCatalogRefDto } from "./get-faults.response";

export interface SanctionDetailDto {
  sanction_id: string;
  fault_id: string;
  collaborator_id: string;
  collaborator_name: string;
  identification_number: string | null;
  fault_catalog: FaultCatalogRefDto;
  occurrence_date: string;
  fault_severity: string;
  sanction_type: string;
  sanction_status: string;
  reason: string;
  suspension_start_date: string | null;
  suspension_end_date: string | null;
  payroll_id: string | null;
  issued_by: string;
  issued_by_user: DisciplinaryUserResponse | null;
  evidences: DisciplinaryEvidenceResponse[];
  created_at: string;
}
