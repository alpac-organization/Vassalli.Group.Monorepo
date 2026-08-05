import type { CreateAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/create-access-control";
import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type { GetReceptionEntranceDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control-detail";
import type { GetVehiclesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-vehicles";
import type { UpdateReceptionEntranceRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/update-access-control";
import type { ReceptionEntranceDetail } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import type { GetReceptionEntrancesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import type { GetVehiclesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-vehicles";
import type { AddDucatsToReceptionRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/add-ducats-to-reception";

export interface IAccessControl {
  getAccessControl(
    payload: GetAccessControlRequest,
  ): Promise<GetReceptionEntrancesResponse>;

  getAccessControlById(
    payload: GetReceptionEntranceDetailRequest,
  ): Promise<ReceptionEntranceDetail>;

  createAccessControl(payload: CreateAccessControlRequest): Promise<void>;

  updateAccessControl(payload: UpdateReceptionEntranceRequest): Promise<void>;

  addDucatsToReception(payload: AddDucatsToReceptionRequest): Promise<void>;

  getVehicles(payload: GetVehiclesRequest): Promise<GetVehiclesResponse>;
}
