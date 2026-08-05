import type { IHttpHandler } from "@app/core/ports";
import type { ISupplierServices } from "@app/modules/purchasing/application/interfaces/supplier/ISuppliersServices";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { GetSupplierDetailsRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-supplier-details-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/create-supplier-response";
import type { GetSupplierDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-supplier-details-response";
import type { GetSuppliersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class SupplierServices implements ISupplierServices {

	private readonly httpHandler: IHttpHandler;

	constructor(htttpHandler: IHttpHandler) {
		this.httpHandler = htttpHandler;
	}

	async getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList> {
		try {
			const { companie_id, module_code, ...rest } = payload;

			const url = `/companies/${companie_id}/modules/${module_code}/suppliers`;

			const response = await this.httpHandler.get<GetSuppliersResponseList>(url, { params: cleanParams(rest) });

			return response;
		} catch (error) {
			throw error;
		}
	}

	async CreateSupplier(payload: CreateSupplierRequest): Promise<CreateSupplierResponse> {
		try {
			const { company_id, module_code, ...rest } = payload;

			const url = `/companies/${company_id}/modules/${module_code}/suppliers`;

			const response = await this.httpHandler.post<CreateSupplierResponse>(url, rest);

			return response;
		} catch (error) {
			throw error;
		}
	}

	async UpdateSupplier(payload: UpdateSupplierRequest): Promise<void> {
		try {
			const { company_id, module_code, supplier_id, ...rest } = payload;			

			const url = `companies/${company_id}/modules/${module_code}/suppliers/${supplier_id}`;

			await this.httpHandler.patch<void>(url, rest);
		} catch (error) {
			throw error;
		}
	}

	async GetSupplierDetails(payload: GetSupplierDetailsRequest): Promise<GetSupplierDetailsResponse> {
		try {
			const { company_id, module_code, supplier_id } = payload;

			const url = `/companies/${company_id}/modules/${module_code}/suppliers/${supplier_id}/details`;

			return await this.httpHandler.get<GetSupplierDetailsResponse>(url);
		} catch (error) {
			throw error;
		}
	}
}
