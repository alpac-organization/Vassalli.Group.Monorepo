import type { IHttpHandler } from "@app/core/ports";
import type { ICustomerServices } from "@app/modules/warehouse/application/interfaces/customer-interfaces/ICustomerServices";
import type { CreateCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/create-customer-type.request";
import type { GetCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-types.request";
import type { CreateCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/create-customer.request";
import type { GetCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer.request";
import type { GetCustomerTypesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/customer-responses/get-customer-types.response";
import type { GetCustomerResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/customer-responses/get-customer.response";
import { cleanParams } from "@app/shared/utils/object.utils";

export class CustomerServices implements ICustomerServices {

	private readonly apiHandler: IHttpHandler;

	constructor(httpHandler: IHttpHandler) {
		this.apiHandler = httpHandler;
	}

	async GetCustomerRecords(payload: GetCustomerRequest): Promise<GetCustomerResponse[]> {

		const { company_id, module_code, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/customers`;

		return await this.apiHandler.get<GetCustomerResponse[]>(url, { params: cleanParams(rest) });

	}

	async GetCustomerTypes(payload: GetCustomerTypeRequest): Promise<GetCustomerTypesResponse[]> {

		const { company_id, module_code, ...rest } = payload;

		const url = `companies/${company_id}/modules/${module_code}/customer-types`;

		return await this.apiHandler.get<GetCustomerTypesResponse[]>(url, { params: cleanParams(rest) });
		
	}

	async CreateCustomer(payload: CreateCustomerRequest): Promise<string> {
		const { company_id, module_code, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/customers`;
		return await this.apiHandler.post<string>(url, rest);
	}

	async CreateCustomerType(payload: CreateCustomerTypeRequest): Promise<string> {
		const { company_id, module_code, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/customer-types`;
		return await this.apiHandler.post<string>(url, rest);
	}
}