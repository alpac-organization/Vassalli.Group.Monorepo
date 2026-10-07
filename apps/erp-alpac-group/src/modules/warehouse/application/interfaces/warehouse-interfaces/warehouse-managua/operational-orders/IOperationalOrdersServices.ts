import type { GetOperationalOrdersRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/get-operational-orders-request";
import type { GetOperationalOrderDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/get-operational-order-detail-request";
import type { UpdateOperationalOrderInformationRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/update-operational-order-information-request";
import type { GetOperationalOrdersResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import type { GetOperationalOrderDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-order-detail-response";

export interface IOperationalOrdersServices {
  /**
   * GET /api/v1/companies/{company_id}/modules/{module_code}/operational-orders
   * Lista las órdenes operacionales (PO) registradas con paginación y filtros opcionales.
   */
  getOperationalOrders(
    payload: GetOperationalOrdersRequest,
  ): Promise<GetOperationalOrdersResponse>;

  /**
   * GET /api/v1/companies/{company_id}/modules/{module_code}/operational-orders/{operational_order_id}/details
   * Obtiene el detalle completo de una orden operacional, incluyendo recepción si aplica.
   */
  getOperationalOrderById(
    payload: GetOperationalOrderDetailRequest,
  ): Promise<GetOperationalOrderDetailResponse | null>;

  /**
   * PATCH /api/v1/companies/{company_id}/modules/{module_code}/operational-orders/{operational_order_id}/information
   * Registra y actualiza la información de recepción de una orden operacional: cliente, peso, bultos y mercadería opcional.
   */
  updateOperationalOrderInformation(
    payload: UpdateOperationalOrderInformationRequest,
  ): Promise<void>;
}
