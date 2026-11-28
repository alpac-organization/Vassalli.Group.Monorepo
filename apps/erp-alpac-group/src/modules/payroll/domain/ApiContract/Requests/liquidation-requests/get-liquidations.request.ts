import type { LiquidationStatusEnumMap } from "@app/modules/payroll/domain/enums/liquidation-enums/liquidation-status.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PaginateBaseRequest } from "@app/shared/interfaces/paginate-base/paginate-base-request";

export interface GetLiquidationsRequest
  extends BaseRequest,
    Partial<PaginateBaseRequest> {
  identification_number?: string;
  status?: LiquidationStatusEnumMap;
  termination_id?: string;
}
