import type { IHttpHandler } from "@app/core/ports";
import type { ISubsidyServices } from "@app/modules/payroll/application/interfaces/subsidy-interfaces/ISubsidyServices";
import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";
import { cleanParams } from "@app/shared/utils/object.utils";

export class SubsidyServices implements ISubsidyServices {

   private readonly httpHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.httpHandler = httpHandler;
   }

   public async CreateSubsidy(payload: CreateSubsidyRequest): Promise<void> {
      try {
         const { company_id, ...rest } = payload;

         const url = `/companies/${company_id}/subsidies`;

         const response = await this.httpHandler.post<void>(url, rest);

         return response;
      } catch (error) {
         throw error;
      }
   }
}