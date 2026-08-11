import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { QuotationItem } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/types/create-quote-form.types";

export type QuoteProductModalProps = {
	isOpen: boolean;
	products: PurchaseRequestProductInformation[];
	onClose: () => void;
	onConfirm?: (items: QuotationItem[]) => void;
};

export type QuoteProductFormValues = {
	items: QuotationItem[];
};

export type QuotationItemFieldsProps = {
	itemIndex: number;
	productName: string;
	categoryName?: string | null;
	supplierOptions: { value: string; label: string }[];
};
