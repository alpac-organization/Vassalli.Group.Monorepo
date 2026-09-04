import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { GetSectionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { GetSectionByIdRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-section-ById";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-byId";
import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { GetLotsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-details-req";
import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-detail";
import type { CreateLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-racks";
import type { GetRackResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import type { GetRackDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-rack-detail";
import type { GetRackDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-detail";
import type { CreateRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";

export interface IWarehouseAdminService {
  GetSections(payload: GetSectionsRequest): Promise<GetSectionsResponse>;
  GetSectionById(payload: GetSectionByIdRequest): Promise<SectionDto>;
  CreateSection(payload: CreateSectionRequest): Promise<void>;
  GetLots(payload: GetLotsRequest): Promise<GetLotsResponse>;
  GetLotsById(payload: GetLotDetailRequest): Promise<LotDetailResponse>;
  CreateLots(payload: CreateLotsRequest): Promise<void>;
  GetRacks(payload: GetRacksRequest): Promise<GetRackResponse>;
  GetRackById(payload: GetRackDetailRequest): Promise<GetRackDetailResponse>;
  CreateRacks(payload: CreateRacksRequest): Promise<void>;
}
