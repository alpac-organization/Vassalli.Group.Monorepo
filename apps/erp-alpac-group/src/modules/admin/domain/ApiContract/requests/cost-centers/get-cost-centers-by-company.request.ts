import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetCostCentersByCompanyRequest extends BaseRequest
{ 
    only_operational?: boolean 
}