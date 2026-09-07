import type { RequisitionManagementReviewDto } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";

export interface AnalyzedQuoteDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	review: RequisitionManagementReviewDto | null;
}
