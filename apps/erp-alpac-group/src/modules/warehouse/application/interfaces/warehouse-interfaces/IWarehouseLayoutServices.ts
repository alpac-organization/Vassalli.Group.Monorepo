import type { CreateLotsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-lots-request";
import type { CreateRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-racks-request";
import type { CreateSectionRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-section-request";
import type { GetLotDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-lot-detail-request";
import type { GetLotsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-lots-request";
import type { GetRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-racks-request";
import type { GetSectionsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-sections-request";
import type { LotDetailResponse, LotListItemResponse, RegisterLotsResultResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/lot-response";
import type { RackSectionFilterResultResponse, RegisterRacksResultResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/rack-response";
import type { SectionResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/section-response";

/**
 * @interface IWarehouseLayoutServices
 * @description Define el contrato para la gestión del layout de los almacenes
 * (secciones, tramos y racks).
 */
export interface IWarehouseLayoutServices {
	GetSections(payload: GetSectionsRequest): Promise<SectionResponse[]>;
	CreateSection(payload: CreateSectionRequest): Promise<void>;
	GetLots(payload: GetLotsRequest): Promise<LotListItemResponse[]>;
	GetLotById(payload: GetLotDetailRequest): Promise<LotDetailResponse>;
	CreateLots(payload: CreateLotsRequest): Promise<RegisterLotsResultResponse>;
	GetRacks(payload: GetRacksRequest): Promise<RackSectionFilterResultResponse>;
	CreateRacks(payload: CreateRacksRequest): Promise<RegisterRacksResultResponse>;
}