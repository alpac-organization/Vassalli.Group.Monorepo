import type { RegisterSupplyRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/supply-requests/register-supply-request.request";

export interface ISupplyRequestServices {
  registerSupplyRequest(payload: RegisterSupplyRequest): Promise<void>;
}
