import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetPurchaseOrderDetailsPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-order-details-payload";
import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import {
	purchaseQueryKeys,
	STALE_TIME_ONE_MINUTE,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";
import { useQuery } from "@tanstack/react-query";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

type UsePurchaseOrderDetailProps = {
	getPurchaseOrderDetailsPayload?: GetPurchaseOrderDetailsPayload;
};

export const usePurchaseOrderDetail = (props?: UsePurchaseOrderDetailProps) => {
	const { getPurchaseOrderDetailsPayload } = props || {};

	const purchaseOrderDetailsEnabled = Boolean(
		getPurchaseOrderDetailsPayload?.company_id?.trim() &&
			getPurchaseOrderDetailsPayload?.module_code?.trim() &&
			getPurchaseOrderDetailsPayload?.purchase_order_id?.trim(),
	);

	const GetPurchaseOrderDetails = useQuery<
		GetPurchaseOrderDetailsResponse,
		ApiErrorResponse
	>({
		queryKey: [purchaseQueryKeys.orderDetails, getPurchaseOrderDetailsPayload],
		queryFn: () =>
			purchaseServices.GetPurchaseOrderDetails(
				getPurchaseOrderDetailsPayload!,
			),
		enabled: purchaseOrderDetailsEnabled,
		staleTime: STALE_TIME_ONE_MINUTE,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	return { GetPurchaseOrderDetails };
};
