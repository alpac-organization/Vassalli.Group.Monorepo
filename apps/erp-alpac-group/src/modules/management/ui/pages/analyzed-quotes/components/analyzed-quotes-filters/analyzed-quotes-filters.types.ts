import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";

export type AnalyzedQuotesFiltersValues = {
	status: managementReviewStatusType | "";
	area_id: string;
	branch_id: string;
};

export type AnalyzedQuotesFiltersProps = {
	onApply: (filters: AnalyzedQuotesFiltersValues) => void;
	onClear: () => void;
};
