import type { IHttpHandler } from "@app/core/ports";
import type { ISanctionService } from "@app/modules/payroll/application/interfaces/sanction-interfaces/ISanctionService";
import type { GetSanctionDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanction-details.request";
import type { GetSanctionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanctions.request";
import type { RegisterSanctionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/register-sanction.request";
import type { SanctionDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanction-details.response";
import type { GetSanctionsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class SanctionServices implements ISanctionService {

   private readonly httpHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.httpHandler = httpHandler;
   }

   async getSanctions(payload: GetSanctionsRequest): Promise<GetSanctionsResponse> {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/sanctions`;
      return await this.httpHandler.get<GetSanctionsResponse>(url, {
         params: cleanParams(rest),
      });
   }

   async getSanctionDetails(payload: GetSanctionDetailsRequest): Promise<SanctionDetailDto> {
      const { company_id, module_code, sanction_id } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/sanctions/${sanction_id}`;
      return await this.httpHandler.get<SanctionDetailDto>(url);
   }

   async registerSanction(payload: RegisterSanctionRequest): Promise<void> {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/sanctions`;
      await this.httpHandler.post<void>(url, rest);
   }
}