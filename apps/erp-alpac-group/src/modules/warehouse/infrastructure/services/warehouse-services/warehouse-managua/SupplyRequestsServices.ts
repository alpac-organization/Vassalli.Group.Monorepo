import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { ISupplyRequestsServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/supply-requests/ISupplyRequestsServices";
import type { GetSupplyRequestsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/get-supply-requests.request";
import type { GetSupplyRequestDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/get-supply-request-detail.request";
import type { RegisterSupplyRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/register-supply-request.request";
import type { ApproveSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/approve-supply-request.request";
import type { DeclineSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/decline-supply-request.request";
import type { SupplyRequestDetailDto, PagedSupplyRequestsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/supply-requests/supply-requests.response";

export class SupplyRequestsServices implements ISupplyRequestsServices {
  private readonly httpClient: IHttpHandler;

  constructor(httpClient: IHttpHandler) {
    this.httpClient = httpClient;
  }

  async GetSupplyRequests(payload: GetSupplyRequestsRequest): Promise<PagedSupplyRequestsResponse> {
    const { company_id, module_code, ...rest } = payload;

    return this.httpClient.get<PagedSupplyRequestsResponse>(
      `/companies/${company_id}/modules/${module_code}/inventory/supply-requests`,
      {
        params: cleanParams(rest),
      },
    );
  }

  async GetSupplyRequestDetail(payload: GetSupplyRequestDetailRequest): Promise<SupplyRequestDetailDto> {
    const { company_id, module_code, supply_request_id, ...rest } = payload;

    return this.httpClient.get<SupplyRequestDetailDto>(
      `/companies/${company_id}/modules/${module_code}/inventory/supply-requests/${supply_request_id}/detail`,
      {
        params: cleanParams(rest),
      },
    );
  }

  async RegisterSupplyRequest(payload: RegisterSupplyRequest): Promise<string> {
    const { company_id, module_code, ...body } = payload;

    const requestBody = cleanParams({
      justification: body.justification,
      operational_order_id: body.operational_order_id,
      items: body.items.map((item) => ({
        product_stock_id: item.product_stock_id,
        amount: item.amount,
      })),
      reason_use: body.reason_use,
    });

    return this.httpClient.post<string>(
      `/companies/${company_id}/modules/${module_code}/inventory/supply-requests`,
      requestBody,
    );
  }

  async ApproveSupplyRequest(payload: ApproveSupplyRequestRequest): Promise<void> {
    const { company_id, module_code, supply_request_id, ...body } = payload;

    const requestBody = cleanParams({
      code: body.code,
      reason_inventory_removal_id: body.reason_inventory_removal_id,
      observations: body.observations,
    });

    return this.httpClient.post<void>(
      `/companies/${company_id}/modules/${module_code}/inventory/supply-requests/${supply_request_id}/approve`,
      requestBody,
    );
  }

  async DeclineSupplyRequest(payload: DeclineSupplyRequestRequest): Promise<void> {
    const { company_id, module_code, supply_request_id, ...body } = payload;

    const requestBody = cleanParams({
      code: body.code,
      observations: body.observations,
    });

    return this.httpClient.post<void>(
      `/companies/${company_id}/modules/${module_code}/inventory/supply-requests/${supply_request_id}/decline`,
      requestBody,
    );
  }
}
