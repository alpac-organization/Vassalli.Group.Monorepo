import type { GetPurchaseRequestResponse } from "./get-purchase-request-response";

export interface GetPurchaseRequestDetailResponse extends GetPurchaseRequestResponse {
	observations: string | null;
	reason_rejection: string | null;	
	information_from_requesting_area: WorkArea;
	creator_user_information: PurchaseRequestUserInformation;
	reviewer_user_information: PurchaseRequestUserInformation | null;
	branch_information: PurchaseRequestBranchInformation;		
}

export interface PurchaseRequestUserInformation {
	user_id: string;
	email: string | null;
	fullname: string | null;
	picture_url: string | null;
}

export interface PurchaseRequestBranchInformation {
	branch_id: string;
	branch_code: string | null;
	branch_name: string | null;
	company_alias: string | null;
}

export interface PurchaseRequestProductInformationList {
	data: PurchaseRequestProductInformation[];
	page_number: number;
	page_size: number;
	total: number;
}

export interface WorkArea {
	work_area_id: string;
	work_area_code: number;
	description: string;
	work_area_name: string;
	cost_centers: CostCenter[];
}

export interface CostCenter {
	cost_center_id: string;
	description: string;
	cost_center_name: string;
	coil_code: number;
	cost_center_code: number;
}

export interface PurchaseRequestUserInformation {
	user_id: string;
	email: string | null;
	fullname: string | null;
	picture_url: string | null;
	user_status: string | null;
	work_area_information: WorkArea;
}

export interface PurchaseRequestProductInformation {
	has_quotation: boolean;
	quantity: number;
	quantity_unit: number | null;
	description: string | null;
	justification: string | null;
	purchase_request_item_id: string;
	product_details: PurchaseRequestProductDetails;
	unit_measure_information: PurchaseRequestUnitMeasureInformation;
	quotations: PurchaseRequestProductQuotation[];
}

export interface PurchaseRequestProductDetails {
	product_id: string;
	product_name: string | null;
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
	supplier_id: string;
	supplier_information: PurchaseRequestProductQuotationSupplier;
}
