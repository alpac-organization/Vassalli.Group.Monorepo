import type { CreateServiceOrderRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/service-order-requests/create-service-order.request";
import type { CreateServiceOrderResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/service-order-responses/create-service-order.response";

/**
 * @interface IServiceOrderServices
 * @description Define el contrato para las ordenes de servicios para operaciones de almacen y agencia aduanera.
 */
export interface IServiceOrderServices {

   CreateServiceOrder(payload: CreateServiceOrderRequest): Promise<CreateServiceOrderResponse>;
}