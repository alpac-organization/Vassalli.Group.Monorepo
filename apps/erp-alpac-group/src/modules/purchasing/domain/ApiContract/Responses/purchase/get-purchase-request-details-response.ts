import type { GetPurchaseRequestResponse } from "./get-purchase-request-response";

export interface GetPurchaseRequestDetailResponse
	extends Omit<GetPurchaseRequestResponse, "revision_date"> {
	observations: string | null;
	reason_rejection: string | null;
	creator_user_information: PurchaseRequestUserInformation;
	reviewer_user_information: PurchaseRequestUserInformation | null;
	branch_information: PurchaseRequestBranchInformation;	
	revision_date: string | null;
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

export interface PurchaseRequestProductInformation {
	purchase_request_item_id: string;
	has_quotation: boolean;
	quantity: number;
	quantity_unit: number | null;
	description: string | null;
	justification: string | null;
	purchase_request_id: string;
	product_details: PurchaseRequestProductDetails;
	unit_measure_information: PurchaseRequestUnitMeasureInformation;
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
