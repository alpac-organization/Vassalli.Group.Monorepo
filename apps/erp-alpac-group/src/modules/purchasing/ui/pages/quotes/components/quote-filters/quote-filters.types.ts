import type { DatePickerValue } from "@alpac/design-system";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";

export type QuoteFilterForm = Pick<GetPurchaseRequestPayload, "code" | "status"> & {
	date: DatePickerValue
};

export type QuoteFiltersProps = {
	codeLabel?: string;
	codeExample?: string;
	codePlaceholder?: string;
	defaultValues?: QuoteFilterForm;
	onApply: (filters: QuoteFilterForm) => void;
	onClear: () => void;
};
