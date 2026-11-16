import type { QueryClient } from "@tanstack/react-query";

export const STALE_TIME_ONE_MINUTE = 1000 * 60;

export const purchaseQueryKeys = {
	requests: "get-purchase-requests",
	requestDetails: "get-purchase-request-details",
	requestProducts: "get-purchase-request-products",
	orders: "get-purchase-orders",
	orderDetails: "get-purchase-order-details",
	monthlyReport: "get-monthly-purchase-report",
	purchaseRequestsLegacy: "purchase-requests",
} as const;

export const financeQueryKeys = {
	quotesAnalysis: "quotes-analysis",
	quotesAnalysisDetails: "quotes-analysis-details",
} as const;

export const managementQueryKeys = {
	reviews: "requisition-management-reviews",
	reviewDetails: "requisition-management-review-details",
} as const;

export function invalidatePurchaseRequestList(queryClient: QueryClient) {
	return queryClient.invalidateQueries({
		queryKey: [purchaseQueryKeys.requests],
	});
}

export function invalidatePurchaseRequestDetail(queryClient: QueryClient) {
	return Promise.all([
		queryClient.invalidateQueries({
			queryKey: [purchaseQueryKeys.requestDetails],
		}),
		queryClient.invalidateQueries({
			queryKey: [purchaseQueryKeys.requestProducts],
		}),
	]);
}

export function invalidatePurchaseOrders(queryClient: QueryClient) {
	return queryClient.invalidateQueries({
		queryKey: [purchaseQueryKeys.orders],
	});
}

export function invalidateQuotesAnalysis(queryClient: QueryClient) {
	return Promise.all([
		queryClient.invalidateQueries({
			queryKey: [financeQueryKeys.quotesAnalysis],
		}),
		queryClient.invalidateQueries({
			queryKey: [financeQueryKeys.quotesAnalysisDetails],
		}),
	]);
}

export function invalidateManagementReviews(queryClient: QueryClient) {
	return queryClient.invalidateQueries({
		queryKey: [managementQueryKeys.reviews],
	});
}

export function invalidatePurchaseQueries(queryClient: QueryClient) {
	return Promise.all([
		invalidatePurchaseRequestList(queryClient),
		queryClient.invalidateQueries({
			queryKey: [purchaseQueryKeys.requestDetails],
		}),
		queryClient.invalidateQueries({
			queryKey: [purchaseQueryKeys.requestProducts],
		}),
		queryClient.invalidateQueries({
			queryKey: [financeQueryKeys.quotesAnalysis],
		}),
	]);
}
