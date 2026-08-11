import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";

export type QuotesTableProps = {
	data: GetPurchaseRequestResponse[];
	onViewDetail: (purchaseRequest: GetPurchaseRequestResponse) => void;	
	onSendForReview: (purchaseRequest: GetPurchaseRequestResponse) => void;
	currentPage: number;
	pageSize: number;
	totalRecords: number;
	onPageChange: (page: number) => void;
	isPaginationDisabled?: boolean;
};
