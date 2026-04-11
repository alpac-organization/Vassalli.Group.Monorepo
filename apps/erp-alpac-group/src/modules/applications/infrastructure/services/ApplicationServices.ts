import type { IHttpHandler } from "@app/core/ports";
import type { IApplicationServices } from "@app/modules/applications/application/interfaces/IApplicationServices";
import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export class ApplicationServices implements IApplicationServices {

   private apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async GetApplications(payload: ApplicationRequest): Promise<GetApplicationsResponse[]> {
      try {
         const { company_id, module_code, ...rest } = payload;
         const response = await this.apiHandler.get<GetApplicationsResponse[]>(
            `/companies/${company_id}/modules/${module_code}/permit-applications`,
            rest,
         );
         console.log("Response:", response)
         return response;
      } catch (error) {
         throw error;
      }
   }

   async ApproveApplication(payload: any): Promise<void> {
      try {
         await this.apiHandler.put(
            `approve`,
            payload,
         );
      } catch (error) {
         throw error;
      }
   }

   async RejectApplication(payload: any): Promise<void> {
      try {
         await this.apiHandler.put(
            `reject`,
            payload,
         );
      } catch (error) {
         throw error;
      }
   }
}