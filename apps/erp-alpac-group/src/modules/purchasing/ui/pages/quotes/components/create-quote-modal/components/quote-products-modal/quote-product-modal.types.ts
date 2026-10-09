import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type {
	QuotationAttachmentsInput,
	QuotationItem,
} from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { SupplierPaymentMethod } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { ImageOutput } from "@app/shared/components/image-uploader/image-uploader.types";

export const MIN_SUPPLIERS_PER_PRODUCT = 2;

export type DraftQuotationItem = QuotationItem & {
	product_id: string;
	supplier_legal_name?: string;
};

export type QuoteProductModalProps = {
	isOpen: boolean;
	products: PurchaseRequestProductInformation[];
	existingItems?: DraftQuotationItem[];
	onClose: () => void;
	onConfirm?: (items: DraftQuotationItem[]) => void;
};

export type QuotationAttachmentForm = {
	pdf_file?: File | null;
	pdf_base64?: string | null;
	pdf_file_name?: string | null;
	images?: ImageOutput[];
};

export type QuotationItemForm = Omit<
	QuotationItem,
	"payment_method_type" | "attachments"
> & {
	payment_method?: PaymentMethodType;
	supplier_legal_name?: string;
	supplier_payment_methods?: SupplierPaymentMethod[];
	preferred_payment_method?: PaymentMethodType;
	attachments_form?: QuotationAttachmentForm;
};

export type QuoteProductGroup = {
	product_id: string;
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
	accordionValue: string;
	canRemove: boolean;
	supplierLegalName: string;
	onRemove: () => void;
};

export type QuoteProductGroupFieldsProps = {
	productIndex: number;
	productName: string;
	categoryName?: string | null;
	quantity: number;
};

export type { QuotationAttachmentsInput };
