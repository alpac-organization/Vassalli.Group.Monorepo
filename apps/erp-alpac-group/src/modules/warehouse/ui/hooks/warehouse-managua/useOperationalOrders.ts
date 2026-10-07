import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { OperationalOrdersServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/OperationalOrdersServices";
import type { GetOperationalOrdersRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/get-operational-orders-request";
import type { GetOperationalOrderDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/get-operational-order-detail-request";
import type { UpdateOperationalOrderInformationRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/operational-orders/update-operational-order-information-request";
import type { GetOperationalOrdersResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import type { GetOperationalOrderDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-order-detail-response";

export const operationalOrdersServices = new OperationalOrdersServices(warehouseHttpHandler);

export type UseOperationalOrdersProps = {
	payloadOperationalOrders?: GetOperationalOrdersRequest;
	detailPayload?: GetOperationalOrderDetailRequest | null;
};

export const useOperationalOrders = (props?: UseOperationalOrdersProps) => {

	const { payloadOperationalOrders, detailPayload } = props ?? {};
	const queryClient = useQueryClient();

	const GetOperationalOrders = useQuery<GetOperationalOrdersResponse, ApiErrorResponse>({
		queryKey: ["operational-orders", payloadOperationalOrders],
		queryFn: () => operationalOrdersServices.getOperationalOrders(payloadOperationalOrders as GetOperationalOrdersRequest),
		enabled: Boolean(
			payloadOperationalOrders?.company_id &&
			payloadOperationalOrders?.module_code,
		),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1
	});

	const orderId = detailPayload?.operational_order_id;

	const GetOperationalOrderDetail = useQuery<GetOperationalOrderDetailResponse | null, ApiErrorResponse>({
		queryKey: ["operational-order-detail", detailPayload],
		queryFn: () => operationalOrdersServices.getOperationalOrderById(detailPayload as GetOperationalOrderDetailRequest),
		enabled: Boolean(
			detailPayload?.company_id &&
			detailPayload?.module_code &&
			orderId,
		),
		staleTime: 1000 * 60 * 2,
		refetchOnWindowFocus: false,
		retry: 1
	});

	const UpdateOperationalOrderInformation = useMutation<void, ApiErrorResponse, UpdateOperationalOrderInformationRequest>({
		mutationFn: (payload) => operationalOrdersServices.updateOperationalOrderInformation(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["operational-orders"] });
			queryClient.invalidateQueries({ queryKey: ["operational-order-detail"] });
		}
	});

	return {
		GetOperationalOrders,
		GetOperationalOrderDetail,
		UpdateOperationalOrderInformation,
		operationalOrdersServices,
	};
};
