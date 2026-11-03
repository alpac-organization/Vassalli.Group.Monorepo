import type { CancelFaultRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/cancel-fault.request";
import type { GetFaultCatalogRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-fault-catalog.request";
import type { GetFaultDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-fault-details.request";
import type { GetFaultsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-faults.request";
import type { GetSuggestedSanctionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-suggested-sanction.request";
import type { RegisterFaultRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/register-fault.request";
import type { GetFaultCatalogResponse } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/fault-catalog.response";
import type { FaultDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-fault-details.response";
import type { GetFaultsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";
import type { SuggestedSanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-suggested-sanction.response";

export interface IFaultService {
  
  getFaultCatalog(payload: GetFaultCatalogRequest): Promise<GetFaultCatalogResponse>;

  getFaults(payload: GetFaultsRequest): Promise<GetFaultsResponse>;

  getFaultDetails(payload: GetFaultDetailsRequest): Promise<FaultDetailDto>;

  registerFaults(payload: RegisterFaultRequest): Promise<void>;

  cancelFault(payload: CancelFaultRequest): Promise<void>;

  getSuggestedSanction(payload: GetSuggestedSanctionRequest): Promise<SuggestedSanctionDto>;
}
