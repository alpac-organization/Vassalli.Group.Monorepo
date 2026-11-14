import type { GetFuelRequestsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/fuel-requests/get-fuel-requests.request";
import type { GetFuelRequestDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/fuel-requests/get-fuel-request-detail.request";
import type { RegisterFuelRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/fuel-requests/register-fuel-request.request";
import type { FuelRequestDetailDto, PagedFuelRequestsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/fuel-requests/fuel-requests.response";

export interface IFuelRequestsServices {
  GetFuelRequests(payload: GetFuelRequestsRequest): Promise<PagedFuelRequestsResponse>;
  GetFuelRequestDetail(payload: GetFuelRequestDetailRequest): Promise<FuelRequestDetailDto>;
  RegisterFuelRequest(payload: RegisterFuelRequest): Promise<string>;
}
