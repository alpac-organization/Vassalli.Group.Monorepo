import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";

type FetchAllPurchaseRequestProductsParams = {
	purchaseServices: PurchaseServices;
	companyId: string;
	moduleCode: string;
	purchaseRequestId: string;
};

export async function fetchAllPurchaseRequestProducts({
	purchaseServices,
	companyId,
	moduleCode,
	purchaseRequestId,
}: FetchAllPurchaseRequestProductsParams): Promise<
	PurchaseRequestProductInformation[]
> {
	const firstPage = await purchaseServices.GetPurchaseRequestProducts({
		company_id: companyId,
		module_code: moduleCode,
		purchase_request_id: purchaseRequestId,
		page_number: 1,
	});

	const firstItems = firstPage.data ?? [];
	const total = firstPage.total ?? firstItems.length;
	if (total <= firstItems.length) return firstItems;

	const pageSize = firstPage.page_size || firstItems.length;
	if (pageSize <= 0) return firstItems;

	const totalPages = Math.ceil(total / pageSize);
	if (totalPages <= 1) return firstItems;

	const remainingPages = await Promise.all(
		Array.from({ length: totalPages - 1 }, (_, index) =>
			purchaseServices.GetPurchaseRequestProducts({
				company_id: companyId,
				module_code: moduleCode,
				purchase_request_id: purchaseRequestId,
				page_number: index + 2,
				page_size: pageSize,
			}),
		),
	);

	return remainingPages.reduce(
		(items, page) => items.concat(page.data ?? []),
		firstItems,
	);
}
