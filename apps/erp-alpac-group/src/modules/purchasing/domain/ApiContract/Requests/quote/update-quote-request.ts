import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { TimeTypeValue } from "@app/core/enums/time-type.enum";
import type { ProductQualityType } from "@app/modules/purchasing/domain/enums/product-quality";
import type { QuotationAttachmentsInput } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateQuoteRequest extends BaseRequest {
	quotation_id: string;
	supplier_id?: string | null;
	has_delivery?: boolean | null;
	has_guarantee?: boolean | null;
	inventory_available?: boolean | null;
	brand_product?: string | null;
	product_quality?: ProductQualityType | null;
	payment_method_type?: PaymentMethodType | null;
	delivery_time?: number | null;
	delivery_time_type?: TimeTypeValue | null;
	warranty_period?: number | null;
	warranty_period_time_type?: TimeTypeValue | null;
	availability_time?: number | null;
	availability_time_type?: TimeTypeValue | null;
	supplier_selection_justification?: string | null;
	attachments?: QuotationAttachmentsInput | null;
}
