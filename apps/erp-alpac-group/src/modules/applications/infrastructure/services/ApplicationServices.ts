import type { IHttpHandler } from "@app/core/ports";
import type { IApplicationServices } from "@app/modules/applications/application/interfaces/IApplicationServices";
import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";
import type { ApplicationProcessRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.process.request";

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
         return response;
      } catch (error) {
         throw error;
      }
   }

   async ApproveApplication(payload: ApplicationProcessRequest): Promise<void> {
      try {
         const { company_id, module_code, permit_application_id, ...rest } = payload;
         await this.apiHandler.post(
            `/companies/${company_id}/modules/${module_code}/permit-applications/${permit_application_id}/process`,
            rest,
         );
      } catch (error) {
         throw error;
      }
   }

   async RejectApplication(payload: ApplicationProcessRequest): Promise<void> {
      try {
         const { company_id, module_code, permit_application_id, ...rest } = payload;
         await this.apiHandler.post(
            `/companies/${company_id}/modules/${module_code}/permit-applications/${permit_application_id}/process`,
            rest,
         );
      } catch (error) {
         throw error;
      }
   }

   async GetApplicationDetail(payload: ApplicationRequest): Promise<GetApplicationsResponse> {
      try {
         const { company_id, module_code, collaborator_code } = payload;
         const response = await this.apiHandler.get<GetApplicationsResponse>(
            `/companies/${company_id}/modules/${module_code}/permit-applications/${collaborator_code}/details`,
         );
         return response;
      } catch (error) {
         throw error;
      }
   }
}