import type { CreateServiceOrderRequest } from "@app/modules/service-order/domain/ApiContract/Requests/service-order-requests/create-service-order.request";
import type { GetServiceOrdersRequest } from "@app/modules/service-order/domain/ApiContract/Requests/service-order-requests/get-service-orders.request";
import type { CreateServiceOrderResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/create-service-order.response";
import type { GetServiceOrdersResponseList } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/get-service-orders.response";

/**
 * @interface IServiceOrderServices
 * @description Define el contrato para las ordenes de servicios para operaciones de almacen y agencia aduanera.
 */
export interface IServiceOrderServices {

   GetServiceOrders (payload: GetServiceOrdersRequest): Promise<GetServiceOrdersResponseList>;

   CreateServiceOrder(payload: CreateServiceOrderRequest): Promise<CreateServiceOrderResponse>;
}