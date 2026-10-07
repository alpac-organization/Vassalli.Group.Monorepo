import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { ILotService } from "@app/modules/admin-warehouse/warehouse-managua/applications/interfaces/ILotService";
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

export class LotService implements ILotService {

	private readonly apiHandler: IHttpHandler;

	constructor(apiHandler: IHttpHandler) {
		this.apiHandler = apiHandler;
	}

	async GetLots(payload: GetLotsRequest): Promise<GetLotsResponse> {
		const { company_id, module_code, warehouse_id, section_id, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots`;
		return await this.apiHandler.get<GetLotsResponse>(url, { params: cleanParams(rest) });
	}

	async RegisterLot(payload: RegisterLotRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, section_id, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots`;
		await this.apiHandler.post<void>(url, rest);
	}

	async GetLotCapacities(payload: GetLotCapacitiesRequest): Promise<LotCapacitiesResponse> {
		const { company_id, module_code, warehouse_id, section_id, lot_id } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots/${lot_id}/capacities`;
		return await this.apiHandler.get<LotCapacitiesResponse>(url);
	}

	async GetLotLayout(payload: GetLotLayoutRequest): Promise<LotLayoutResponse> {
		const { company_id, module_code, warehouse_id, section_id } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots-layout`;
		return await this.apiHandler.get<LotLayoutResponse>(url);
	}

	async GetLotCoordinates(payload: GetLotCoordinatesRequest): Promise<LotCoordinatesResponse> {
		const { company_id, module_code, warehouse_id, section_id, lot_id } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots/${lot_id}/coordinates`;
		return await this.apiHandler.get<LotCoordinatesResponse>(url);
	}

	async RegisterLotCoordinates(payload: RegisterLotCoordinatesRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, section_id, lot_id, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots/${lot_id}/coordinates`;
		await this.apiHandler.post<void>(url, rest);
	}

	async UpdateLotCoordinates(payload: UpdateLotCoordinatesRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, section_id, lot_id, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/lots/${lot_id}/coordinates`;
		await this.apiHandler.patch<void>(url, rest);
	}
}
