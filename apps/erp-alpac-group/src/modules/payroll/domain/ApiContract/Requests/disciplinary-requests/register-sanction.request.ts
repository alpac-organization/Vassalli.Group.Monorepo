import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { DisciplinaryEvidenceRequest } from "./disciplinary-evidence.request";
import type { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import { SanctionTypeEnum as SanctionTypeEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";

export interface RegisterSanctionRequest extends BaseRequest {
  fault_id: string;
  sanction_type: keyof typeof SanctionTypeEnumMap | SanctionTypeEnum | number;
  reason: string;
  suspension_start_date?: string | null;
  suspension_end_date?: string | null;
  evidences?: DisciplinaryEvidenceRequest[];
}
