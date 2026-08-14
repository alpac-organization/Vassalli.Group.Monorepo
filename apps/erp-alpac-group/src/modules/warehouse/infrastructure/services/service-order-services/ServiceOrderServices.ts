import type { IHttpHandler } from "@app/core/ports";
import type { IServiceOrderServices } from "@app/modules/warehouse/application/interfaces/service-order-interfaces/IServiceOrderServices";
import type { CreateServiceOrderRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/service-order-requests/create-service-order.request";
import type { CreateServiceOrderResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/service-order-responses/create-service-order.response";

export class ServiceOrderServices implements IServiceOrderServices {

   private readonly apiHandler: IHttpHandler;

   constructor(httpHandler: IHttpHandler) {
      this.apiHandler = httpHandler;
   }

   async CreateServiceOrder(payload: CreateServiceOrderRequest): Promise<CreateServiceOrderResponse> {
      const { company_id, module_code, branch_id, customer_id, observations, ...rest } = payload;

      const url = `companies/${company_id}/branches/${branch_id}/modules/${module_code}/service-orders`;

      const response = await this.apiHandler.post<CreateServiceOrderResponse>(url, {
         customer_id,
         observations: observations?.trim() || undefined,
         ...rest,
      });

      return response;
   }
}