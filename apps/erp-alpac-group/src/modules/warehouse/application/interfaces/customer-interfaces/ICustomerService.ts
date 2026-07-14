import type { GetCustomerDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-details.request";
import type { GetCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-types.request";
import type { GetCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer.request";

/**
 * @interface ICustomerService
 * @description Define el contrato para los servicios de clientes del almacén.
 */
export interface ICustomerService {

   GetCustomerRecords(payload: GetCustomerRequest): Promise<any>;

   GetCustomerDetails(payload: GetCustomerDetailRequest): Promise<any>;

   GetCustomerTypes(payload: GetCustomerTypeRequest): Promise<any>;
}