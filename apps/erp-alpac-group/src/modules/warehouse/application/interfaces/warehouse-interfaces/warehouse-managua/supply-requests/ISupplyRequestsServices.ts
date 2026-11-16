import type { GetSupplyRequestsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/get-supply-requests.request";
import type { GetSupplyRequestDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/get-supply-request-detail.request";
import type { RegisterSupplyRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/register-supply-request.request";
import type { ApproveSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/approve-supply-request.request";
import type { DeclineSupplyRequestRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/decline-supply-request.request";
import type { SupplyRequestDetailDto, PagedSupplyRequestsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/supply-requests/supply-requests.response";

export interface ISupplyRequestsServices {
  GetSupplyRequests(payload: GetSupplyRequestsRequest): Promise<PagedSupplyRequestsResponse>;
  GetSupplyRequestDetail(payload: GetSupplyRequestDetailRequest): Promise<SupplyRequestDetailDto>;
  RegisterSupplyRequest(payload: RegisterSupplyRequest): Promise<string>;
  ApproveSupplyRequest(payload: ApproveSupplyRequestRequest): Promise<void>;
  DeclineSupplyRequest(payload: DeclineSupplyRequestRequest): Promise<void>;
}
