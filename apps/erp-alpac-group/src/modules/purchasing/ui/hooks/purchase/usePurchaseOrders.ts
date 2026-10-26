import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PurchaseOrderDocumentRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-order-request";
import type { GetPurchaseOrdersPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-orders-payload";
import type { PurchaseOrderDocumentResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-document-response";
import type { GetPurchaseOrdersResponseList } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import {
	purchaseQueryKeys,
	STALE_TIME_ONE_MINUTE,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";
import { useMutation, useQuery } from "@tanstack/react-query";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

type UsePurchaseOrdersProps = {
	getPurchaseOrdersPayload?: GetPurchaseOrdersPayload;
};

export const usePurchaseOrders = (props?: UsePurchaseOrdersProps) => {
	const { getPurchaseOrdersPayload } = props || {};

	const purchaseOrdersEnabled = Boolean(
		getPurchaseOrdersPayload?.company_id?.trim() &&
			getPurchaseOrdersPayload?.module_code?.trim() &&
			getPurchaseOrdersPayload?.page_number &&
			getPurchaseOrdersPayload?.page_size,
	);

	const GetPurchaseOrders = useQuery<
		GetPurchaseOrdersResponseList,
		ApiErrorResponse
	>({
		queryKey: [purchaseQueryKeys.orders, getPurchaseOrdersPayload],
		queryFn: () =>
			purchaseServices.GetPurchaseOrders(getPurchaseOrdersPayload!),
		enabled: purchaseOrdersEnabled,
		staleTime: STALE_TIME_ONE_MINUTE,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetPurchaseOrderDocument = useMutation<
		PurchaseOrderDocumentResponse,
		ApiErrorResponse,
		PurchaseOrderDocumentRequest
	>({
		mutationKey: ["get-purchase-order-document"],
		mutationFn: (payload) =>
			purchaseServices.GetPurchaseOrderDocument(payload),
		retry: 1,
	});

	return {
		GetPurchaseOrders,
		GetPurchaseOrderDocument,
	};
};
