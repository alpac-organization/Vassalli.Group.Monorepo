import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetMonthlyPurchaseReportPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-monthly-purchase-report-payload";
import type { GetMonthlyPurchaseReportResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-monthly-purchase-report-response";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import {
	purchaseQueryKeys,
	STALE_TIME_ONE_MINUTE,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";
import { useQuery } from "@tanstack/react-query";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

type UseMonthlyPurchaseReportProps = {
	getMonthlyPurchaseReportPayload?: GetMonthlyPurchaseReportPayload;
};

export const useMonthlyPurchaseReport = (
	props?: UseMonthlyPurchaseReportProps,
) => {
	const { getMonthlyPurchaseReportPayload } = props || {};

	const monthlyPurchaseReportEnabled = Boolean(
		getMonthlyPurchaseReportPayload?.company_id?.trim() &&
			getMonthlyPurchaseReportPayload?.module_code?.trim(),
	);

	const GetMonthlyPurchaseReport = useQuery<
		GetMonthlyPurchaseReportResponse,
		ApiErrorResponse
	>({
		queryKey: [
			purchaseQueryKeys.monthlyReport,
			getMonthlyPurchaseReportPayload,
		],
		queryFn: () =>
			purchaseServices.GetMonthlyPurchaseReport(
				getMonthlyPurchaseReportPayload!,
			),
		enabled: monthlyPurchaseReportEnabled,
		staleTime: STALE_TIME_ONE_MINUTE,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	return { GetMonthlyPurchaseReport };
};
