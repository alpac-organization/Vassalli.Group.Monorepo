export interface QuoteSelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (data: any) => void;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
	selectionType: "single" | "multiple";
	selectedQuoteId?: string | null;
}
