import type { RegisterRacksBulkRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/register-racks-bulk-req";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/get-racks-req";
import type { GetRackDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/get-rack-details-req";
import type { UpdateRackRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/update-rack-req";
import type { DeleteRackRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/racks/delete-rack-req";
import type { GetRacksResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";
import type { GetRackDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-rack-details-res";

export interface IRackService {
  RegisterRacksBulk(payload: RegisterRacksBulkRequest): Promise<void>;

  GetRacksBySection(payload: GetRacksRequest): Promise<GetRacksResponse>;

  GetRackDetails(payload: GetRackDetailsRequest): Promise<GetRackDetailsResponse>;

  UpdateRack(payload: UpdateRackRequest): Promise<void>;

  DeleteRack(payload: DeleteRackRequest): Promise<void>;
}
