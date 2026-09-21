import type { SupplierDetailsInformation } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-details";
import type { SupplierBankAccount } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import type { GetSuppliersResponse, SupplierUserInformation } from "./get-suppliers-response";

export interface GetSupplierDetailsResponse extends GetSuppliersResponse {
	supplier_details: SupplierDetailsInformation;
	bank_accounts?: SupplierBankAccount[];
	user_information: SupplierUserInformation;
}