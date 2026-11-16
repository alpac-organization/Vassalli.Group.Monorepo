import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import { purchaseQueryKeys } from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";
import { fetchAllPurchaseRequestProducts } from "@app/modules/purchasing/ui/pages/purchase-order/utils/fetch-purchase-request-products";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

type UsePurchaseRequestProductsAllArgs = {
	companyId: string;
	moduleCode: string;
	purchaseRequestId?: string | null;
	enabled?: boolean;
};

export function usePurchaseRequestProductsAll({
	companyId,
	moduleCode,
	purchaseRequestId,
	enabled = true,
}: UsePurchaseRequestProductsAllArgs) {
	const trimmedRequestId = purchaseRequestId?.trim() || "";
	const queryEnabled = Boolean(
		enabled &&
			companyId.trim() &&
			moduleCode.trim() &&
			trimmedRequestId,
	);

	return useQuery({
		queryKey: [
			purchaseQueryKeys.requestProducts,
			"all",
			companyId,
			moduleCode,
			trimmedRequestId,
		],
		queryFn: () =>
			fetchAllPurchaseRequestProducts({
				purchaseServices,
				companyId,
				moduleCode,
				purchaseRequestId: trimmedRequestId,
			}),
		enabled: queryEnabled,
		staleTime: 0,
		refetchOnWindowFocus: false,
		retry: 1,
	});
}
