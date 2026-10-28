import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSeverityEnum as FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import type { FaultStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import { FaultStatusEnum as FaultStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import type { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { FaultSourceEnum as FaultSourceEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";

export interface GetFaultsRequest extends BaseRequest {
  code?: string;
  collaborator_id?: string;
  severity?: keyof typeof FaultSeverityEnumMap | FaultSeverityEnum | number | string;
  status?: keyof typeof FaultStatusEnumMap | FaultStatusEnum | number | string;
  source?: keyof typeof FaultSourceEnumMap | FaultSourceEnum | number | string;
  page_number?: number;
  page_size?: number;
}
