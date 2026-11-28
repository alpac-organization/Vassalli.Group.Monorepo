import type { TerminationStatusEnumMap } from "@app/modules/payroll/domain/enums/termination-enums/termination-status.enum";
import type { TerminationTypeEnumMap } from "@app/modules/payroll/domain/enums/termination-enums/termination-type.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PaginateBaseRequest } from "@app/shared/interfaces/paginate-base/paginate-base-request";

export interface GetTerminationsRequest
  extends BaseRequest,
    Partial<PaginateBaseRequest> {
  identification_number?: string;
  termination_type?: TerminationTypeEnumMap;
  termination_status?: TerminationStatusEnumMap;
}
