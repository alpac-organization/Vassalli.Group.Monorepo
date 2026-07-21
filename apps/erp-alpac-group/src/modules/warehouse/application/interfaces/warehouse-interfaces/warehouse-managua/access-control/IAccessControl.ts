import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type { GetAccessControlResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
export interface IAccessControl {
  getAccessControl(
    payload: GetAccessControlRequest,
  ): Promise<GetAccessControlResponse>;
}
