import type { IHttpHandler } from "@app/core/ports";
import type { ISupplierServices } from "@app/modules/purchasing/application/interfaces/supplier/ISuppliersServices";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { GetSupplierDetailsRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-supplier-details-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/create-supplier-response";
import type { GetSupplierDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-supplier-details-response";
import type { GetSuppliersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import type {
	CreateSupplierBankAccountPayload,
	SupplierBankAccount,
	UpdateSupplierBankAccountPayload,
} from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import { cleanParams } from "@app/shared/utils/object.utils";

export class SupplierServices implements ISupplierServices {
	private readonly httpHandler: IHttpHandler;

	constructor(httpHandler: IHttpHandler) {
		this.httpHandler = httpHandler;
	}

	async getSuppliers(payload: GetSuppliersRequest): Promise<GetSuppliersResponseList> {
		const { company_id, module_code, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/suppliers`;
		return this.httpHandler.get<GetSuppliersResponseList>(url, {
			params: cleanParams(rest),
		});
	}

	async CreateSupplier(payload: CreateSupplierRequest): Promise<CreateSupplierResponse> {
		const { company_id, module_code, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/suppliers`;
		return this.httpHandler.post<CreateSupplierResponse>(url, rest);
	}

	async UpdateSupplier(payload: UpdateSupplierRequest): Promise<void> {
		const { company_id, module_code, supplier_id, ...rest } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/suppliers/${supplier_id}`;
		await this.httpHandler.patch<void>(url, rest);
	}

	async GetSupplierDetails(payload: GetSupplierDetailsRequest): Promise<GetSupplierDetailsResponse> {
		const { company_id, module_code, supplier_id } = payload;
		const url = `/companies/${company_id}/modules/${module_code}/suppliers/${supplier_id}/details`;
		return this.httpHandler.get<GetSupplierDetailsResponse>(url);
	}

	async getBankAccounts(
		companyId: string,
		moduleCode: string,
		supplierId: string,
	): Promise<SupplierBankAccount[]> {
		const url = `/companies/${companyId}/modules/${moduleCode}/suppliers/${supplierId}/bank-accounts`;
		return this.httpHandler.get<SupplierBankAccount[]>(url);
	}

	async createBankAccount(
		companyId: string,
		moduleCode: string,
		supplierId: string,
		payload: CreateSupplierBankAccountPayload,
	): Promise<SupplierBankAccount> {
		const url = `/companies/${companyId}/modules/${moduleCode}/suppliers/${supplierId}/bank-accounts`;
		return this.httpHandler.post<SupplierBankAccount>(url, payload);
	}

	async updateBankAccount(
		companyId: string,
		moduleCode: string,
		supplierId: string,
		bankAccountId: string,
		payload: UpdateSupplierBankAccountPayload,
	): Promise<void> {
		const url = `/companies/${companyId}/modules/${moduleCode}/suppliers/${supplierId}/bank-accounts/${bankAccountId}`;
		await this.httpHandler.patch<void>(url, payload);
	}

	async deleteBankAccount(
		companyId: string,
		moduleCode: string,
		supplierId: string,
		bankAccountId: string,
	): Promise<void> {
		const url = `/companies/${companyId}/modules/${moduleCode}/suppliers/${supplierId}/bank-accounts/${bankAccountId}`;
		await this.httpHandler.delete<void>(url);
	}
}
