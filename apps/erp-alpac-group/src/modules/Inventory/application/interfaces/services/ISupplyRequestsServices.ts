import type { GetSupplyRequestsRequest } from "../../domain/api-contract/requests/supply-requests/get-supply-requests.request";
import type { GetSupplyRequestDetailRequest } from "../../domain/api-contract/requests/supply-requests/get-supply-request-detail.request";
import type { RegisterSupplyRequest } from "../../domain/api-contract/requests/supply-requests/register-supply-request.request";
import type { SupplyRequestDetailDto, PagedSupplyRequestsResponse } from "../../domain/api-contract/responses/supply-requests.response";

export interface ISupplyRequestsServices {
  GetSupplyRequests(payload: GetSupplyRequestsRequest): Promise<PagedSupplyRequestsResponse>;
  GetSupplyRequestDetail(payload: GetSupplyRequestDetailRequest): Promise<SupplyRequestDetailDto>;
  RegisterSupplyRequest(payload: RegisterSupplyRequest): Promise<void>;
}
