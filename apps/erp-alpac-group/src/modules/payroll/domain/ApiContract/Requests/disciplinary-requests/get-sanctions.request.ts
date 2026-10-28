import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import { SanctionTypeEnum as SanctionTypeEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import type { SanctionStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import { SanctionStatusEnum as SanctionStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";

export interface GetSanctionsRequest extends BaseRequest {
  collaborator_id?: string;
  fault_id?: string;
  sanction_type?:
    | keyof typeof SanctionTypeEnumMap
    | SanctionTypeEnum
    | number
    | string;
  sanction_status?:
    | keyof typeof SanctionStatusEnumMap
    | SanctionStatusEnum
    | number
    | string;
  page_number?: number;
  page_size?: number;
}
