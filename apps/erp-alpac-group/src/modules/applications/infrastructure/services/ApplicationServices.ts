import type { IHttpHandler } from "@app/core/ports";
import type { IApplicationServices } from "@app/modules/applications/application/interfaces/IApplicationServices";
import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import type { GetApplicationsListResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

export class ApplicationServices implements IApplicationServices {

   private apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async GetApplications(payload: ApplicationRequest): Promise<GetApplicationsListResponse> {
      try {
         const response = await this.apiHandler.get<GetApplicationsListResponse>(
            `/applications`,
            payload,
         );
         return response;
      } catch (error) {
         throw error;
      }
   }
}