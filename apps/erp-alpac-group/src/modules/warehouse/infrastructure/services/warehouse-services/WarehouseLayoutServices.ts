import type { IHttpHandler } from "@app/core/ports";
import type { IWarehouseLayoutServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/IWarehouseLayoutServices";
import type { CreateLotsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-lots-request";
import type { CreateRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-racks-request";
import type { CreateSectionRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-section-request";
import type { GetLotDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-lot-detail-request";
import type { GetLotsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-lots-request";
import type { GetRackDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-rack-detail-request";
import type { GetRacksRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-racks-request";
import type { GetSectionsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-sections-request";
import type { LotDetailResponse, LotListItemResponse, RegisterLotsResultResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/lot-response";
import type { RackDetailResponse, RackSectionFilterResultResponse, RegisterRacksResultResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/rack-response";
import type { SectionResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/section-response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class WarehouseLayoutServices implements IWarehouseLayoutServices {
	private readonly apiHandler: IHttpHandler;

	constructor(httpHandler: IHttpHandler) {
		this.apiHandler = httpHandler;
	}

	async GetSections(payload: GetSectionsRequest): Promise<SectionResponse[]> {
		const { company_id, module_code, warehouse_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/warehouse/${warehouse_id}/sections`;

		return await this.apiHandler.get<SectionResponse[]>(url, { params: cleanParams(rest) });
	}

	async CreateSection(payload: CreateSectionRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/warehouse/${warehouse_id}/sections`;

		await this.apiHandler.post<void>(url, rest);
	}

	async GetLots(payload: GetLotsRequest): Promise<LotListItemResponse[]> {
		const { company_id, module_code, section_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/lots`;

		return await this.apiHandler.get<LotListItemResponse[]>(url, { params: cleanParams(rest) });
	}

	async GetLotById(payload: GetLotDetailRequest): Promise<LotDetailResponse> {
		const { company_id, module_code, section_id, lot_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/lots/${lot_id}`;

		return await this.apiHandler.get<LotDetailResponse>(url, { params: cleanParams(rest) });
	}

	async CreateLots(payload: CreateLotsRequest): Promise<RegisterLotsResultResponse> {
		const { company_id, module_code, section_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/lots`;

		return await this.apiHandler.post<RegisterLotsResultResponse>(url, rest);
	}

	async GetRacks(payload: GetRacksRequest): Promise<RackSectionFilterResultResponse> {
		const { company_id, module_code, section_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/racks`;

		return await this.apiHandler.get<RackSectionFilterResultResponse>(url, { params: cleanParams(rest) });
	}

	async GetRackById(payload: GetRackDetailRequest): Promise<RackDetailResponse> {
		const { company_id, module_code, rack_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/racks/${rack_id}`;

		return await this.apiHandler.get<RackDetailResponse>(url, { params: cleanParams(rest) });
	}

	async CreateRacks(payload: CreateRacksRequest): Promise<RegisterRacksResultResponse> {
		const { company_id, module_code, section_id, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/sections/${section_id}/racks`;

		return await this.apiHandler.post<RegisterRacksResultResponse>(url, rest);
	}
}