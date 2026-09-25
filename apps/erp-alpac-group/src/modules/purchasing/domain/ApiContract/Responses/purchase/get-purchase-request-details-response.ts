import type {
	BranchInformation,
	CostCenterInformation,
	UserInformation,
	WorkAreaInformation,
} from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";
import type { ProductQualityType } from "@app/modules/purchasing/domain/enums/product-quality";
import type { PaymentConditionType } from "@app/core/enums/payment-method.enum";

export interface GetPurchaseRequestDetailResponse extends GetPurchaseRequestResponse {
	observations: string | null;
	reason_rejection: string | null;
	annulment_reason: string | null;
	creator_user_information: UserInformation;
	reviewer_user_information: UserInformation | null;
	branch_information: BranchInformation;
	information_from_requesting_area: WorkAreaInformation;
	cost_center_information: CostCenterInformation;
}

export type PurchaseRequestProductInformationList = PaginateBaseResponse<PurchaseRequestProductInformation[]>;

export interface PurchaseRequestProductInformation {
	has_quotation: boolean;
	purchase_request_item_id: string;
	quantity: number;
	quantity_unit: number | null;
	description: string | null;
	justification: string | null;
	additional_data: string | null;
	product_details: PurchaseRequestProductDetails;
	unit_measure_information: PurchaseRequestUnitMeasureInformation;
	quotations: PurchaseRequestProductQuotation[];
}

export interface PurchaseRequestProductDetails {
	product_id: string;
	product_name: string | null;
	product_code?: string | null;
	category_information: PurchaseRequestCategoryInformation;
}

export interface PurchaseRequestCategoryInformation {
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
	is_accepted_for_purchase: boolean;
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
	product_quality: ProductQualityType;
	payment_method: PaymentConditionType;
	iventory_available?: boolean;
	availability_time?: number | null;
	availability_time_type?: string | number | null;
	supplier_rejection_justification: string | null;
	supplier_id: string;
	supplier_information: PurchaseRequestProductQuotationSupplier;
}
