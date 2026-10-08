import { warehouseHttpHandler } from "@app/core/adapters";
import { CustomerServices } from "@app/modules/customer/infrastructure/services/customer-services/CustomerServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCustomerRequest } from "@app/modules/customer/domain/ApiContract/Requests/customer-requests/get-customer.request";
import type { GetCustomerTypeRequest } from "@app/modules/customer/domain/ApiContract/Requests/customer-requests/get-customer-types.request";
import type { CreateCustomerRequest } from "@app/modules/customer/domain/ApiContract/Requests/customer-requests/create-customer.request";
import type { CreateCustomerTypeRequest } from "@app/modules/customer/domain/ApiContract/Requests/customer-requests/create-customer-type.request";
import type { GetCustomerResponse } from "@app/modules/customer/domain/ApiContract/Responses/customer-responses/get-customer.response";
import type { GetCustomerTypesResponse } from "@app/modules/customer/domain/ApiContract/Responses/customer-responses/get-customer-types.response";

const customerService = new CustomerServices(warehouseHttpHandler);

export const useCustomer = () => {
	const queryClient = useQueryClient();

	const CreateCustomer = useMutation<string, ApiErrorResponse, CreateCustomerRequest>({
		mutationFn: (payload) => customerService.CreateCustomer(payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["get-customer-records", variables.company_id],
			});
		},
	});

	const CreateCustomerType = useMutation<
		string,
		ApiErrorResponse,
		CreateCustomerTypeRequest
	>({
		mutationFn: (payload) => customerService.CreateCustomerType(payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["get-customer-types", variables.company_id],
			});
		},
	});

	const GetCustomer = (
		payload: GetCustomerRequest,
		options?: { enabled?: boolean },
	) => {
		return useQuery<GetCustomerResponse, ApiErrorResponse>({
			queryKey: ["get-customer-records", payload.company_id],
			queryFn: () => customerService.GetCustomerRecords(payload),
			enabled: options?.enabled,
			refetchOnWindowFocus: false,
			retry: 1,
		});
	};

	const GetCustomerTypes = (
		payload: GetCustomerTypeRequest,
		options?: { enabled?: boolean },
	) => {
		return useQuery<GetCustomerTypesResponse[], ApiErrorResponse>({
			queryKey: ["get-customer-types", payload.company_id],
			queryFn: () => customerService.GetCustomerTypes(payload),
			enabled: options?.enabled,
			refetchOnWindowFocus: false,
			retry: 1,
		});
	};

	return {
		CreateCustomer,
		CreateCustomerType,
		GetCustomer,
		GetCustomerTypes,
	};
};
