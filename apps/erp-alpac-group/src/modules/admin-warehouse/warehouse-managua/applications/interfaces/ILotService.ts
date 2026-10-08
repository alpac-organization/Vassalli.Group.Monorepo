import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetLotsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { GetLotCapacitiesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-capacities-req";
import type { LotCapacitiesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-capacities-res";
import type { GetLotLayoutRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-layout-req";
import type { LotLayoutResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-layout-res";
import type { GetLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-coordinates-req";
import type { LotCoordinatesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-coordinates-res";
import type { RegisterLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/register-lot-coordinates-req";
import type { UpdateLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/update-lot-coordinates-req";
import type { UpdateLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/update-lot-req";

export interface ILotService {
  
  GetLots(payload: GetLotsRequest): Promise<GetLotsResponse>;

  RegisterLot(payload: RegisterLotRequest): Promise<void>;

  UpdateLot(payload: UpdateLotRequest): Promise<void>;

  GetLotCapacities(payload: GetLotCapacitiesRequest): Promise<LotCapacitiesResponse>;

  GetLotLayout(payload: GetLotLayoutRequest): Promise<LotLayoutResponse>;

  GetLotCoordinates(payload: GetLotCoordinatesRequest): Promise<LotCoordinatesResponse>;

  RegisterLotCoordinates(payload: RegisterLotCoordinatesRequest): Promise<void>;

  UpdateLotCoordinates(payload: UpdateLotCoordinatesRequest): Promise<void>;
}
