import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { DisciplinaryEvidenceRequest } from "./disciplinary-evidence.request";
import type { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { FaultSourceEnum as FaultSourceEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";

export interface RegisterFaultItemRequest {
  collaborator_id: string;
  fault_catalog_id: string;
  occurrence_date: string;
  source: keyof typeof FaultSourceEnumMap | FaultSourceEnum | number;
  parent_fault_id?: string | null;
  evidences?: DisciplinaryEvidenceRequest[];
}

export interface RegisterFaultRequest extends BaseRequest {
  faults: RegisterFaultItemRequest[];
}
