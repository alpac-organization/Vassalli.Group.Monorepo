import type { IHttpHandler } from "@app/core/ports";
import type { ICustomerServices } from "@app/modules/warehouse/application/interfaces/customer-interfaces/ICustomerServices";
import type { GetCustomerDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-details.request";
import type { GetCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-types.request";
import type { GetCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer.request";
import { cleanParams } from "@app/shared/utils/object.utils";

export class CustomerServices implements ICustomerServices {

	private readonly apiHandler: IHttpHandler;

	constructor(httpHandler: IHttpHandler) {
		this.apiHandler = httpHandler;
	}

	async GetCustomerRecords(payload: GetCustomerRequest): Promise<any> {
		try {
			const { company_id, ...rest } = payload;

			const url = `companies/${company_id}/customers`;

			return await this.apiHandler.get<any>(url, { params: cleanParams(rest) });

		} catch (error) {
			throw error;
		}
	}

	async GetCustomerDetails(payload: GetCustomerDetailRequest): Promise<any> {
		try {
			const { company_id, customer_id, ...rest } = payload;

			const url = `companies/${company_id}/customers/${customer_id}/details`;

			return await this.apiHandler.get<any>(url, { params: cleanParams(rest) });

		} catch (error) {
			throw error;
		}
	}

	async GetCustomerTypes(payload: GetCustomerTypeRequest): Promise<any> {
		try {
			const { company_id, ...rest } = payload;

			const url = `companies/${company_id}/types-customers`;

			return await this.apiHandler.get<any>(url, { params: cleanParams(rest) });

		} catch (error) {
			throw error;
		}
	}
}