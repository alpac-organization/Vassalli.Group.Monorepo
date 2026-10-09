import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type {
	BranchInformation,
	CostCenterInformation,
	UserInformation,
	WorkAreaInformation,
} from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { ProductQualityType } from "@app/modules/purchasing/domain/enums/product-quality";

export interface GetPurchaseRequestDetailResponse extends GetPurchaseRequestResponse {
	observations: string | null;
	reason_rejection: string | null;
	additional_data?: string | null;
	is_management_approved?: boolean;
	is_accounting_approved?: boolean;
	is_purchase_order_generated?: boolean;
	creator_user_information: UserInformation;
	reviewer_user_information: UserInformation | null;
	branch_information: BranchInformation;
	information_from_requesting_area: WorkAreaInformation;
	cost_center_information: CostCenterInformation;
	purchase_request_items?: PurchaseRequestProductInformation[];
}

export interface PurchaseRequestAdditionalData {
	new_field: string;
	old_fields: string;
	updated_at: string;
	description: string;
	user_information: UserInformation;
}

export type PurchaseRequestProductInformationList =
	PaginateBaseResponse<PurchaseRequestProductInformation[]>;

export interface PurchaseRequestItemRecommendations {
	best_warranty_quotation_id: string | null;
	best_delivery_quotation_id: string | null;
}

export interface PurchaseRequestProductInformation {
	has_quotation: boolean;
	purchase_request_item_id: string;
	quantity: number;
	quantity_unit: number | null;
	description: string | null;
	justification: string | null;
	additional_data: string | null;
	product_details: PurchaseRequestProductDetails | null;
	unit_measure_information: PurchaseRequestUnitMeasureInformation | null;
	quotations: PurchaseRequestProductQuotation[];
	recommendations?: PurchaseRequestItemRecommendations | null;
}

export interface PurchaseRequestProductTierPrice {
	tier_price_id: string;
	min_quantity: number;
	preferential_price: number;
	valid_from: string | null;
	valid_to: string | null;
}

export interface PurchaseRequestSupplierProduct {
	supplier_product_id: string;
	supplier_id: string;
	unit_price: number | null;
	currency: string | null;
	exclusive_status_comments: string | null;
	suppliers_legal_name: string | null;
	commercial_name: string | null;
	tier_prices: PurchaseRequestProductTierPrice[];
}

export interface PurchaseRequestProductDetails {
	product_id: string;
	product_name: string | null;
	code?: string | null;
	/** @deprecated Prefer `code`. */
	product_code?: string | null;
	is_tax_exempt?: boolean;
	category_information: PurchaseRequestCategoryInformation | null;
	supplier_products?: PurchaseRequestSupplierProduct[];
}

export interface PurchaseRequestCategoryInformation {
	/** Backend DTO typo — keep as-is for serialization. */
	catagory_id: string;
	name: string | null;
	code: string | null;
}

export interface PurchaseRequestUnitMeasureInformation {
	code: string | null;
	name: string | null;
	symbol: string | null;
}

export interface PurchaseRequestProductQuotationSupplier {
	supplier_id: string;
	image_url: string | null;
	suppliers_legal_name: string | null;
	identification_number: string | null;
	identification_type: string | null;
}

export interface PurchaseRequestProductQuotation {
	quotation_id: string;
	is_active: boolean;
	has_delivery: boolean;
	has_guarantee: boolean;
	inventory_available?: boolean;
	/** @deprecated Prefer `inventory_available`. */
	iventory_available?: boolean;
	is_accepted_for_purchase: boolean;
	is_best_option?: boolean;
	iva: number;
	price: number;
	price_unit: number;
	price_total: number;
	quote_date: string;
	brand_product: string | null;
	delivery_time: number | null;
	delivery_time_type: string | null;
	warranty_period: number | null;
	warranty_period_time_type: string | null;
	supplier_selection_justification: string | null;
	supplier_rejection_justification: string | null;
	product_quality: ProductQualityType;
	payment_method_type?: PaymentMethodType;
	/** @deprecated Prefer `payment_method_type`. */
	payment_method?: PaymentMethodType | string;
	availability_time?: number | null;
	availability_time_type?: string | number | null;
	additional_data?: string | null;
	supplier_product_id?: string | null;
	supplier_id: string;
	supplier_information: PurchaseRequestProductQuotationSupplier;
}
