import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";

export interface PurchaseOrderItemQuotationSupplier {
	supplier_id: string;
	image_url: string | null;
	suppliers_legal_name: string | null;
	identification_number: string | null;
	identification_type: string | null;
}

export interface PurchaseOrderItemQuotation {
	quotation_id: string;
	is_accepted_for_purchase: boolean;
	price_unit: number;
	price_total: number;
	payment_method_type: PaymentMethodType;
	supplier_id: string;
	supplier_information: PurchaseOrderItemQuotationSupplier;
}

export interface PurchaseOrderDetailItem {
	purchase_order_item_id: string;
	purchase_request_item_id: string;
	product_id: string;
	product_name: string | null;
	product_code: string | null;
	quantity: number;
	unit_price: number;
	quotation: PurchaseOrderItemQuotation;
}

export interface GetPurchaseOrderDetailsResponse {
	comments: string | null;
	sent_to_review_at: string;
	purchase_order_id: string;
	purchase_order_code: string | null;
	supplier_id: string | null;
	supplier_name: string | null;
	sent_by_user_information: UserInformation | null;
	reviewer_user_information: UserInformation | null;
	items: PurchaseOrderDetailItem[];
}
