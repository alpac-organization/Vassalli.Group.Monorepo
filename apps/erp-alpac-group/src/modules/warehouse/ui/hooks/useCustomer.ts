import { httpHandler } from "@app/core/adapters";
import { CustomerServices } from "@app/modules/warehouse/infrastructure/services/customer-services/CustomerServices";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { GetCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer.request";
import type { GetCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/get-customer-types.request";

import type { CreateCustomerRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/create-customer.request";
import type { CreateCustomerTypeRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/customer-requests/create-customer-type.request";

const customerService = new CustomerServices(httpHandler);

export const useCustomer = () => {

	const CreateCustomer = useMutation({
		mutationFn: (payload: CreateCustomerRequest) => customerService.CreateCustomer(payload)
	});

	const CreateCustomerType = useMutation({
		mutationFn: (payload: CreateCustomerTypeRequest) => customerService.CreateCustomerType(payload)
	});

	const GetCustomer = (payload: GetCustomerRequest, options?: { enabled?: boolean }) => {

		return useQuery({
			queryKey: ["get-customer-records", payload.company_id],
			queryFn: () => customerService.GetCustomerRecords(payload),
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
		CreateCustomer,
		CreateCustomerType,
		GetCustomer,
		GetCustomerTypes
	}
}