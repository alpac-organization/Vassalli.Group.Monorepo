import type { IHttpHandler } from "@app/core/ports";
import type { IFaultService } from "@app/modules/payroll/application/interfaces/fault-interfaces/IFaultService";
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
import { cleanParams } from "@app/shared/utils/object.utils";

export class FaultServices implements IFaultService {
   private readonly httpHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.httpHandler = httpHandler;
   }

   async getFaultCatalog(payload: GetFaultCatalogRequest): Promise<GetFaultCatalogResponse> {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/fault-catalogs`;
      return await this.httpHandler.get<GetFaultCatalogResponse>(url, {
         params: cleanParams(rest),
      });
   }

   async getFaults(payload: GetFaultsRequest): Promise<GetFaultsResponse> {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/faults`;
      return await this.httpHandler.get<GetFaultsResponse>(url, {
         params: cleanParams(rest),
      });
   }

   async getFaultDetails(payload: GetFaultDetailsRequest): Promise<FaultDetailDto> {
      const { company_id, module_code, fault_id } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/faults/${fault_id}`;
      return await this.httpHandler.get<FaultDetailDto>(url);
   }

   async registerFaults(payload: RegisterFaultRequest): Promise<void> {
      const { company_id, module_code, ...rest } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/faults`;
      await this.httpHandler.post<void>(url, rest);
   }

   async cancelFault(payload: CancelFaultRequest): Promise<void> {
      const { company_id, module_code, fault_id } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/faults/${fault_id}`;
      await this.httpHandler.delete<void>(url);
   }

   async getSuggestedSanction(payload: GetSuggestedSanctionRequest): Promise<SuggestedSanctionDto> {
      const { company_id, module_code, fault_id } = payload;
      const url = `/companies/${company_id}/modules/${module_code}/faults/${fault_id}/suggested-sanction`;
      return await this.httpHandler.get<SuggestedSanctionDto>(url);
   }
}
