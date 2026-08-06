import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";
import type { GetSuppliersResponse } from "./get-suppliers-response";

export interface SupplierAreaInformation {
	area_id: string;
	area_code: number;
	work_area_name: string;
}

export interface SupplierUserInformation {
	user_id: string;
	user_fullname: string;
	email: string;
	area_information: SupplierAreaInformation;
}

export interface GetSupplierDetailsResponse extends GetSuppliersResponse {
	supplier_details: SupplierDetailsInformation;
	user_information: SupplierUserInformation;
}