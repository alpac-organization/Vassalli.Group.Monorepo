import type { IHttpHandler } from "@app/core/ports";
import type { IOperationalOrdersServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/operational-orders/IOperationalOrdersServices";
import type { GetOperationalOrdersRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/get-operational-orders-request";
import type { GetOperationalOrderDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/get-operational-order-detail-request";
import type { UpdateOperationalOrderInformationRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/update-operational-order-information-request";
import type { GetOperationalOrdersResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import type { GetOperationalOrderDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-order-detail-response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class OperationalOrdersServices implements IOperationalOrdersServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  /**
   * Lista órdenes operacionales (PO) registradas con paginación y filtros opcionales.
   * Utiliza `cleanParams` para evitar enviar cadenas vacías (?code= o ?customer_cif=)
   * que provocarían 400 Validation_Error en el backend.
   */
  public async getOperationalOrders(
    payload: GetOperationalOrdersRequest,
  ): Promise<GetOperationalOrdersResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders`;
    return this.httpHandler.get<GetOperationalOrdersResponse>(url, {
      params: cleanParams(rest),
    });
  }

  /**
   * Obtiene el detalle completo de una orden operacional.
   * Si la orden no existe, el backend devuelve 200 OK con body `null`.
   */
  public async getOperationalOrderById(
    payload: GetOperationalOrderDetailRequest,
  ): Promise<GetOperationalOrderDetailResponse | null> {
    const { company_id, module_code } = payload;
    const orderId = payload.operational_order_id ;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${orderId}/details`;
    return this.httpHandler.get<GetOperationalOrderDetailResponse | null>(url);
  }

  /**
   * Registra y actualiza la información de recepción de una orden operacional.
   * Asigna cliente, peso, cantidad de bultos y asignación de mercadería opcional.
   */
  public async updateOperationalOrderInformation(
    payload: UpdateOperationalOrderInformationRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      operationalOrderId,
      ...body
    } = payload;
    const orderId = operational_order_id || operationalOrderId;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${orderId}/information`;
    return this.httpHandler.patch<void>(url, body);
  }
}
