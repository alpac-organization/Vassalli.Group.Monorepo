import type { GetSanctionDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanction-details.request";
import type { GetSanctionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanctions.request";
import type { RegisterSanctionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/register-sanction.request";
import type { SanctionDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanction-details.response";
import type { GetSanctionsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";

export interface ISanctionService {
  
  getSanctions(payload: GetSanctionsRequest): Promise<GetSanctionsResponse>;

  getSanctionDetails(payload: GetSanctionDetailsRequest): Promise<SanctionDetailDto>;

  registerSanction(payload: RegisterSanctionRequest): Promise<void>;
}
