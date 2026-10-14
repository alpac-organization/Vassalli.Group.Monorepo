import type { DatePickerValue } from "@alpac/design-system";
import type { OwnershipFilterValue } from "@app/modules/purchasing/domain/enums/ownership-filter.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";

export type PurchaseRequestFilterForm = {
	code: string;
	status: PurchaseRequestStatusType | null;
	date: DatePickerValue;
	area_id: string | null;
	ownership: OwnershipFilterValue | null;
};

export type PurchaseRequestFiltersProps = {
	codeLabel: string;
	codePlaceholder: string;
	isAdministrator: boolean;
	currentBranchId: string;
	onApplyFilters: (data: PurchaseRequestFilterForm) => void;
	onClearFilters: () => void;
};
