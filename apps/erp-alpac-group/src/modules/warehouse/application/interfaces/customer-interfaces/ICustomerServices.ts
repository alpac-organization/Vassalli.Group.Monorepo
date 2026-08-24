import type { CreateCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/create-customer-type.request";
import type { GetCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-types.request";
import type { CreateCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/create-customer.request";
import type { GetCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer.request";
import type { GetCustomerTypesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/customer-responses/get-customer-types.response";
import type { GetCustomerResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/customer-responses/get-customer.response";

/**
 * @interface ICustomerServices
 * @description Define el contrato para los servicios de clientes del almacén.
 */
export interface ICustomerServices {

   GetCustomerRecords(payload: GetCustomerRequest): Promise<GetCustomerResponse[]>;

   GetCustomerTypes(payload: GetCustomerTypeRequest): Promise<GetCustomerTypesResponse[]>;

   CreateCustomer(payload: CreateCustomerRequest): Promise<string>;

   CreateCustomerType(payload: CreateCustomerTypeRequest): Promise<string>;
}