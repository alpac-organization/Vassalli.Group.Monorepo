import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { CreateSectionRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-section-request";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-lots-request";
import type { LotDetailResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotDetailRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-details-req";
import type { RegisterLotsResultResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/lot-response";
import type { CreateLotsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-lots-request";
import type { GetRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-racks-request";
import type {
  RackDetailResponse,
  RackSectionFilterResultResponse,
  RegisterRacksResultResponse,
} from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/rack-response";
import type { GetRackDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-rack-detail-request";
import type { CreateRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-racks-request";

export interface IWarehouseAdminService {
  GetSections(payload: GetSectionsRequest): Promise<SectionResponse[]>;
  CreateSection(payload: CreateSectionRequest): Promise<void>;
  GetLots(payload: GetLotsRequest): Promise<LotListItemResponse[]>;
  GetLotsById(payload: GetLotDetailRequest): Promise<LotDetailResponse>;
  CreateLots(payload: CreateLotsRequest): Promise<RegisterLotsResultResponse>;
  GetRacks(payload: GetRacksRequest): Promise<RackSectionFilterResultResponse>;
  GetRackById(payload: GetRackDetailRequest): Promise<RackDetailResponse>;
  CreateRacks(
    payload: CreateRacksRequest,
  ): Promise<RegisterRacksResultResponse>;
}
