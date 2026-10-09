import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { TimeTypeValue } from "@app/core/enums/time-type.enum";
import type { ProductQualityType } from "@app/modules/purchasing/domain/enums/product-quality";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface QuotationAttachmentsInput {
	pdf_base64?: string | null;
	pdf_file_name?: string | null;
	images_base64?: string[] | null;
}

export interface QuotationItem {
	supplier_id: string;
	purchase_request_item_id: string;
	has_delivery: boolean;
	has_guarantee: boolean;
	inventory_available?: boolean;
	supplier_selection_justification: string;
	brand_product?: string | null;
	product_quality: ProductQualityType;
	payment_method_type?: PaymentMethodType | null;
	availability_time?: number | null;
	availability_time_type?: TimeTypeValue | null;
	delivery_time?: number | null;
	delivery_time_type?: TimeTypeValue | null;
	warranty_period?: number | null;
	warranty_period_time_type?: TimeTypeValue | null;
	attachments?: QuotationAttachmentsInput | null;
}

export interface RegisterQuoteRequest extends BaseRequest {
	quotation_items: QuotationItem[];
}
