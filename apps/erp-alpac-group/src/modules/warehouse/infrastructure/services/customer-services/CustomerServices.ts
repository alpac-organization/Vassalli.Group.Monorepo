import type { IHttpHandler } from "@app/core/ports";
import type { ICustomerService } from "@app/modules/warehouse/application/interfaces/customer-interfaces/ICustomerService";
import type { GetCustomerDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-details.request";
import type { GetCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-types.request";
import type { GetCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer.request";
import { cleanParams } from "@app/shared/utils/object.utils";

export class CustomerServices implements ICustomerService {

	private apiHandler: IHttpHandler;

	constructor(httpHandler: IHttpHandler) {
		this.apiHandler = httpHandler;
	}

	GetCustomerRecords(payload: GetCustomerRequest): Promise<any> {
		try {
			const { company_id, ...rest } = payload;

			const url = `companies/${company_id}/customers`;

			return this.apiHandler.get<any>(url, { params: cleanParams(rest) });

		} catch (error) {
			throw error;
		}
	}

	GetCustomerDetails(payload: GetCustomerDetailRequest): Promise<any> {
		try {
			const { company_id, customer_id, ...rest } = payload;

			const url = `companies/${company_id}/customers/${customer_id}/details`;

			return this.apiHandler.get<any>(url, { params: cleanParams(rest) });

		} catch (error) {
			throw error;
		}
	}

	GetCustomerTypes(payload: GetCustomerTypeRequest): Promise<any> {
		try {
			const { company_id, ...rest } = payload;

			const url = `companies/${company_id}/types-customers`;

			return this.apiHandler.get<any>(url, { params: cleanParams(rest) });

		} catch (error) {
			throw error;
		}
	}
}