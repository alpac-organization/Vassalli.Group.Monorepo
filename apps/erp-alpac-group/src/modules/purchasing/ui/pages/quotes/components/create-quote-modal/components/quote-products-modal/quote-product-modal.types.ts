import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { QuotationItem } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";

export const MIN_SUPPLIERS_PER_PRODUCT = 2;

export type QuoteProductModalProps = {
	isOpen: boolean;
	products: PurchaseRequestProductInformation[];
	onClose: () => void;
	onConfirm?: (items: QuotationItem[]) => void;
};

export type QuotationItemForm = QuotationItem & {
	supplier_legal_name?: string;
	has_iva?: boolean;
};

export type QuoteProductGroup = {
	purchase_request_item_id: string;
	product_name: string;
	category_name?: string | null;
	quantity: number;
	items: QuotationItemForm[];
};

export type QuoteProductFormValues = {
	products: QuoteProductGroup[];
};

export type QuotationItemFieldsProps = {
	productIndex: number;
	itemIndex: number;
	canRemove: boolean;
	supplierLegalName: string;
	quantity: number;
	onRemove: () => void;
};

export type QuoteProductGroupFieldsProps = {
	productIndex: number;
	productName: string;
	categoryName?: string | null;
	quantity: number;
};
