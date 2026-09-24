import type { IHttpHandler } from "@app/core/ports";
import type { ISectionService } from "@app/modules/admin-warehouse/warehouse-managua/applications/interfaces/ISectionService";
import type { DeleteSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/delete-section-req";
import type { GetSectionDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-section-details-req";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-sections-req";
import type { RegisterSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-req";
import type { RegisterSectionCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-coordinates-req";
import type { UpdateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/update-section-req";
import type { GetSectionDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-section-details-res";
import type { GetSectionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import { cleanParams } from "@app/shared/utils/object.utils";

export class SectionService implements ISectionService {

	private readonly apiHandler: IHttpHandler;

	constructor(apiHandler: IHttpHandler) {
		this.apiHandler = apiHandler;
	}

	async RegisterSection(payload: RegisterSectionRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections`;
		await this.apiHandler.post<void>(url, rest);
	}

	async RegisterSectionCoordinates(payload: RegisterSectionCoordinatesRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, section_id, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/coordinates`;
		await this.apiHandler.post<void>(url, rest);
	}

	async GetSections(payload: GetSectionsRequest): Promise<GetSectionsResponse> {
		const { company_id, module_code, warehouse_id, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections`;
		return await this.apiHandler.get<GetSectionsResponse>(url, { params: cleanParams(rest) });
	}

	async GetSectionDetails(payload: GetSectionDetailsRequest): Promise<GetSectionDetailsResponse> {
		const { company_id, module_code, warehouse_id, section_id } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}/details`;
		return await this.apiHandler.get<GetSectionDetailsResponse>(url);
	}

	async UpdateSection(payload: UpdateSectionRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, section_id, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}`;
		await this.apiHandler.patch<void>(url, rest);
	}

	async DeleteSection(payload: DeleteSectionRequest): Promise<void> {
		const { company_id, module_code, warehouse_id, section_id } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/warehouses/${warehouse_id}/sections/${section_id}`;
		await this.apiHandler.delete<void>(url);
	}
}
