import type { IHttpHandler } from "@app/core/ports";
import type { IServiceOrderServices } from "@app/modules/warehouse/application/interfaces/service-order-interfaces/IServiceOrderServices";
import type { CreateServiceOrderRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/service-order-requests/create-service-order.request";

export class ServiceOrderServices implements IServiceOrderServices {

   private apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async CreateServiceOrder(payload: CreateServiceOrderRequest): Promise<void> {
      try {
         const { company_id, module_code, ...rest } = payload;

         const url = `companies/${company_id}/modules/${module_code}/service-orders`;

         await this.apiHandler.post(url, rest);
         
      } catch (error) {
         throw error;
      }
   }
}