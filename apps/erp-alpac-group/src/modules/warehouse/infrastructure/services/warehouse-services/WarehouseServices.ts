import type { IHttpHandler } from "@app/core/ports";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import { cleanParams } from "@app/shared/utils/object.utils";
import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";
import type { IWarehouseServices } from "@app/modules/warehouse/application/interfaces/warehouse-interfaces/IWarehousesServices";
import type { GetCustomBranchesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-custom-branches-request";
import type { GetCustomBranchesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/custom-branches-response";
import type { GetWarehouseDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-details-request";
import type { GetWarehouseDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-details-response";
import type { UpdateWarehouseDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/update-warehouse-details-request";
import type { GetWarehouseCapacitiesRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouse-capacities-request";
import type { GetWarehouseCapacitiesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-capacities-response";

export class WarehouseServices implements IWarehouseServices {

	private readonly apiHandler: IHttpHandler;

	constructor(httpHandler: IHttpHandler) {
		this.apiHandler = httpHandler;
	}

	async GetWarehouses(payload: GetWarehouseRequest): Promise<GetWarehousesResponse> {
		const { company_id, module_code, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouse`;
		return await this.apiHandler.get<GetWarehousesResponse>(url, {
			params: cleanParams(rest),
		});
	}

	async CreateWarehouse(payload: CreateWarehouseRequest): Promise<void> {
		const { company_id, module_code, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouse`;
		await this.apiHandler.post<void>(url, rest);
	}

	async GetCustomBranches(payload: GetCustomBranchesRequest): Promise<GetCustomBranchesResponse> {
		const { company_id, module_code } = payload;
		const url = `companies/${company_id}/modules/${module_code}/customs-branches`;
		return await this.apiHandler.get<GetCustomBranchesResponse>(url);
	}

	async GetWarehouseDetails(payload: GetWarehouseDetailsRequest): Promise<GetWarehouseDetailsResponse> {
		const { company_id, module_code, warehouse_id } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouse/${warehouse_id}`;
		return await this.apiHandler.get<GetWarehouseDetailsResponse>(url);
	}

	async UpdateWarehouseDetails(payload: UpdateWarehouseDetailsRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouse/${warehouse_id}`;
		await this.apiHandler.patch<void>(url, rest);
	}

	async GetWarehouseCapacities(payload: GetWarehouseCapacitiesRequest): Promise<GetWarehouseCapacitiesResponse> {
		const { company_id, module_code, warehouse_id } = payload;
		const url = `companies/${company_id}/modules/${module_code}/warehouse/${warehouse_id}/capacities`;
		return await this.apiHandler.get<GetWarehouseCapacitiesResponse>(url);
	}
}
