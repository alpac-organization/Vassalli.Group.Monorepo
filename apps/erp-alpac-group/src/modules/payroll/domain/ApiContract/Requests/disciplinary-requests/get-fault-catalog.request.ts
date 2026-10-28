import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSeverityEnum as FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";

export interface GetFaultCatalogRequest extends BaseRequest {
  severity?: keyof typeof FaultSeverityEnumMap | FaultSeverityEnum | number | string;
  code?: string;
  page_number?: number;
  page_size?: number;
}
