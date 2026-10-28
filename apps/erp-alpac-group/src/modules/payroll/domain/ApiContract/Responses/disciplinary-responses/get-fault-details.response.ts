import type { DisciplinaryEvidenceResponse } from "./disciplinary-evidence.response";
import type { DisciplinaryUserResponse } from "./disciplinary-user.response";
import type { FaultCatalogRefDto } from "./get-faults.response";

export interface ParentFaultDto {
  fault_id: string;
  occurrence_date: string;
  severity: string;
  status: string;
}

export interface FaultDetailDto {
  fault_id: string;
  collaborator_id: string;
  collaborator_name: string;
  identification_number: string | null;
  fault_catalog: FaultCatalogRefDto;
  occurrence_date: string;
  severity: string;
  source: string;
  status: string;
  evidences: DisciplinaryEvidenceResponse[];
  parent_fault: ParentFaultDto | null;
  registered_by: DisciplinaryUserResponse | null;
  created_at: string;
}
