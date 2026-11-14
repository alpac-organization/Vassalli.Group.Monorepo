import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { IFuelRequestsServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/warehouse-managua/fuel-requests/IFuelRequestsServices";
import type { GetFuelRequestsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/fuel-requests/get-fuel-requests.request";
import type { GetFuelRequestDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/fuel-requests/get-fuel-request-detail.request";
import type { RegisterFuelRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/fuel-requests/register-fuel-request.request";
import type { FuelRequestDetailDto, PagedFuelRequestsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/fuel-requests/fuel-requests.response";

export class FuelRequestsServices implements IFuelRequestsServices {
  private readonly httpClient: IHttpHandler;

  constructor(httpClient: IHttpHandler) {
    this.httpClient = httpClient;
  }

  async GetFuelRequests(payload: GetFuelRequestsRequest): Promise<PagedFuelRequestsResponse> {
    const { company_id, module_code, ...rest } = payload;

    return this.httpClient.get<PagedFuelRequestsResponse>(
      `/companies/${company_id}/modules/${module_code}/inventory/fuel-requests`,
      { params: cleanParams(rest) },
    );
  }

  async GetFuelRequestDetail(payload: GetFuelRequestDetailRequest): Promise<FuelRequestDetailDto> {
    const { company_id, module_code, fuel_request_id, ...rest } = payload;

    return this.httpClient.get<FuelRequestDetailDto>(
      `/companies/${company_id}/modules/${module_code}/inventory/fuel-requests/${fuel_request_id}/detail`,
      { params: cleanParams(rest) },
    );
  }

  async RegisterFuelRequest(payload: RegisterFuelRequest): Promise<string> {
    const { company_id, module_code, ...body } = payload;

    const requestBody = cleanParams({
      justification: body.justification,
      machinery_id: body.machinery_id,
      product_stock_id: body.product_stock_id,
      requested_quantity: body.requested_quantity,
      mileage: body.mileage,
      engine_hours: body.engine_hours,
      customer_id: body.customer_id,
    });

    return this.httpClient.post<string>(
      `/companies/${company_id}/modules/${module_code}/inventory/fuel-requests`,
      requestBody,
    );
  }
}
