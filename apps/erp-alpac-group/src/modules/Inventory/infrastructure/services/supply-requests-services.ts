import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { ISupplyRequestsServices } from "../../application/interfaces/services/ISupplyRequestsServices";
import type { GetSupplyRequestsRequest } from "../../domain/api-contract/requests/supply-requests/get-supply-requests.request";
import type { GetSupplyRequestDetailRequest } from "../../domain/api-contract/requests/supply-requests/get-supply-request-detail.request";
import type { RegisterSupplyRequest } from "../../domain/api-contract/requests/supply-requests/register-supply-request.request";
import type { SupplyRequestDetailDto, PagedSupplyRequestsResponse } from "../../domain/api-contract/responses/supply-requests.response";

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

  async RegisterSupplyRequest(payload: RegisterSupplyRequest): Promise<void> {
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

    return this.httpClient.post<void>(
      `/companies/${company_id}/modules/${module_code}/inventory/supply-requests`,
      requestBody,
    );
  }
}
