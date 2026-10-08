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

  public async getOperationalOrders(
    payload: GetOperationalOrdersRequest,
  ): Promise<GetOperationalOrdersResponse> {
    const { company_id, module_code, ...rest } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders`;
    return this.httpHandler.get<GetOperationalOrdersResponse>(url, {
      params: cleanParams(rest),
    });
  }

  public async getOperationalOrderById(
    payload: GetOperationalOrderDetailRequest,
  ): Promise<GetOperationalOrderDetailResponse | null> {
    const { company_id, module_code } = payload;
    const orderId = payload.operational_order_id ;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${orderId}/details`;
    return this.httpHandler.get<GetOperationalOrderDetailResponse | null>(url);
  }

  public async updateOperationalOrderInformation(
    payload: UpdateOperationalOrderInformationRequest,
  ): Promise<void> {
    const {
      company_id,
      module_code,
      operational_order_id,
      ...body
    } = payload;
    const url = `/companies/${company_id}/modules/${module_code}/operational-orders/${operational_order_id}/information`;
    return this.httpHandler.patch<void>(url, body);
  }
}
