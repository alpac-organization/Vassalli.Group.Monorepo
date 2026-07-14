import { httpHandler } from "@app/core/adapters";
import { CustomerServices } from "@app/modules/warehouse/infrastructure/services/customer-services/CustomerServices";
import { useQuery } from "@tanstack/react-query";
import type { GetCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer.request";
import type { GetCustomerDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-details.request";
import type { GetCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-types.request";

const customerService = new CustomerServices(httpHandler);

export const useCustomer = () => {

	const GetCustomer = (payload: GetCustomerRequest, options?: { enabled?: boolean }) => {

		return useQuery({
			queryKey: ["get-customer-records", payload.company_id],
			queryFn: () => customerService.GetCustomerRecords(payload),
			enabled: options?.enabled,
			refetchOnWindowFocus: false,
			retry: 1,
		});
	}

	const GetCustomerDetails = (payload: GetCustomerDetailRequest, options?: { enabled?: boolean }) => {

		return useQuery({
			queryKey: ["get-customer-details", payload.company_id, payload.customer_id],
			queryFn: () => customerService.GetCustomerDetails(payload),
			enabled: options?.enabled,
			refetchOnWindowFocus: false,
			retry: 1,
		});
	}

	const GetCustomerTypes = (payload: GetCustomerTypeRequest, options?: { enabled?: boolean }) => {

		return useQuery({
			queryKey: ["get-customer-types", payload.company_id],
			queryFn: () => customerService.GetCustomerTypes(payload),
			enabled: options?.enabled,
			refetchOnWindowFocus: false,
			retry: 1,
		});
	}

	return {
		GetCustomer,
		GetCustomerDetails,
		GetCustomerTypes
	}
}