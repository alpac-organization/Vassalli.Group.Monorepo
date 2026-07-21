import type { IHttpHandler } from "@app/core/ports";
import type { ISupplierServices } from "@app/modules/procurement/application/interfaces/suppliers/ISuppliersServices";
import type { CreateSupplierRequest } from "@app/modules/procurement/domain/suppliers/requests/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/procurement/domain/suppliers/requests/get-suppliers-request";
import type { UpdateSupplierRequest } from "@app/modules/procurement/domain/suppliers/requests/update-suppliers-request";
import type { GetSuppliersResponseList } from "@app/modules/procurement/domain/suppliers/responses/get-suppliers-response";
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

	async CreateSupplier(payload: CreateSupplierRequest): Promise<void> {
		try {
			const { company_id, module_code, ...rest } = payload;

			const url = `/companies/${company_id}/modules/${module_code}/suppliers`;

			await this.httpHandler.post<void>(url, rest);
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
}
