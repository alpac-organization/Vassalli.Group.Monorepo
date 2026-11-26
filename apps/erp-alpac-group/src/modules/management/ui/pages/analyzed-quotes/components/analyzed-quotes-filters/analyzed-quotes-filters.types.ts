import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export type AnalyzedQuotesFiltersValues = {
	status: managementReviewStatusType | "";
	area_id: string;
	branch_id: string;
	code: string;
	priority_level: PriorityLevelType | "";
	request_type: PurchaseRequestType | "";
};

export type AnalyzedQuotesFiltersProps = {
	onApply: (filters: AnalyzedQuotesFiltersValues) => void;
	onClear: () => void;
};
