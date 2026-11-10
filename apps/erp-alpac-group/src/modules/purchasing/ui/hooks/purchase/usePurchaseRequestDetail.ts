import { warehouseHttpHandler } from "@app/core/adapters";
import type { GetPurchaseRequestDetailPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-details-payload";
import type { GetPurchaseRequestProductPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-product-payload";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import { purchaseQueryKeys } from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";
import { useQuery } from "@tanstack/react-query";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

type UsePurchaseRequestDetailProps = {
	getPurchaseRequestDetailsPayload?: GetPurchaseRequestDetailPayload;
	getPurchaseRequestProductsPayload?: GetPurchaseRequestProductPayload;
};

export const usePurchaseRequestDetail = (
	props?: UsePurchaseRequestDetailProps,
) => {
	const {
		getPurchaseRequestDetailsPayload,
		getPurchaseRequestProductsPayload,
	} = props || {};

	const purchaseRequestDetailEnabled = Boolean(
		getPurchaseRequestDetailsPayload?.company_id?.trim() &&
			getPurchaseRequestDetailsPayload?.module_code?.trim() &&
			getPurchaseRequestDetailsPayload?.purchase_request_id?.trim(),
	);

	const purchaseRequestProductEnabled = Boolean(
		getPurchaseRequestProductsPayload?.company_id?.trim() &&
			getPurchaseRequestProductsPayload?.module_code?.trim() &&
			getPurchaseRequestProductsPayload?.purchase_request_id?.trim(),
	);

	const GetPurchaseRequestDetails = useQuery({
		queryKey: [
			purchaseQueryKeys.requestDetails,
			getPurchaseRequestDetailsPayload,
		],
		queryFn: () =>
			purchaseServices.GetPurchaseRequestDetails(
				getPurchaseRequestDetailsPayload!,
			),
		enabled: purchaseRequestDetailEnabled,
		staleTime: 0,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const GetPurchaseRequestProducts = useQuery({
		queryKey: [
			purchaseQueryKeys.requestProducts,
			getPurchaseRequestProductsPayload,
		],
		queryFn: () =>
			purchaseServices.GetPurchaseRequestProducts(
				getPurchaseRequestProductsPayload!,
			),
		enabled: purchaseRequestProductEnabled,
		staleTime: 0,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	return {
		GetPurchaseRequestDetails,
		GetPurchaseRequestProducts,
	};
};
