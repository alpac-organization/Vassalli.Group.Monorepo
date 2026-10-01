import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { GetSectionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetLotsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-details-req";
import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";
import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { GetLotCapacitiesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-capacities-req";
import type { LotCapacitiesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-capacities-res";
import type { GetLotLayoutRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-layout-req";
import type { LotLayoutResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-layout-res";
import type { GetLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lot-coordinates-req";
import type { LotCoordinatesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-coordinates-res";
import type { RegisterLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/register-lot-coordinates-req";
import type { UpdateLotCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/update-lot-coordinates-req";
import type { GetSectionDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-section-details-req";
import type { GetSectionDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-section-details-res";
export interface IWarehouseAdminService {
  GetSections(payload: GetSectionsRequest): Promise<GetSectionsResponse>;
  CreateSection(payload: CreateSectionRequest): Promise<void>;
  GetSectionDetails(
    payload: GetSectionDetailsRequest,
  ): Promise<GetSectionDetailsResponse>;
  GetLots(payload: GetLotsRequest): Promise<GetLotsResponse>;
  GetLotsById(payload: GetLotDetailRequest): Promise<LotDetailResponse>;
  RegisterLot(payload: RegisterLotRequest): Promise<void>;
  GetLotCapacities(
    payload: GetLotCapacitiesRequest,
  ): Promise<LotCapacitiesResponse>;
  GetLotLayout(payload: GetLotLayoutRequest): Promise<LotLayoutResponse>;
  GetLotCoordinates(
    payload: GetLotCoordinatesRequest,
  ): Promise<LotCoordinatesResponse>;
  RegisterLotCoordinates(payload: RegisterLotCoordinatesRequest): Promise<void>;
  UpdateLotCoordinates(payload: UpdateLotCoordinatesRequest): Promise<void>;
}
