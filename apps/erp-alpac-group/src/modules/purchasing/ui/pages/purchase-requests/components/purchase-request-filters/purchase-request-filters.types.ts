import type { DatePickerValue } from "@alpac/design-system";

export type PurchaseRequestFilterForm = {
	code: string;
	status: number | null;
	date: DatePickerValue;
	area_id: string | null;
};

export type PurchaseRequestFiltersProps = {
	codeLabel: string;
	codePlaceholder: string;
	isAdministrator: boolean;
	currentBranchId: string;
	onApplyFilters: (data: PurchaseRequestFilterForm) => void;
	onClearFilters: () => void;
};
