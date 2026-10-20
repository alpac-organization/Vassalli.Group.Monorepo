import type { GetSupplierDetailsRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-supplier-details-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { CreateSupplierBankAccountPayload, UpdateSupplierBankAccountPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";

export type useSuppliersProps = {
	suppliersFilters?: GetSuppliersRequest;
	supplierDetailFilters?: GetSupplierDetailsRequest;
};

export type CreateBankAccountMutationArgs = {
	companyId: string;
	moduleCode: string;
	supplierId: string;
	payload: CreateSupplierBankAccountPayload;
};

export type UpdateBankAccountMutationArgs = {
	companyId: string;
	moduleCode: string;
	supplierId: string;
	bankAccountId: string;
	payload: UpdateSupplierBankAccountPayload;
};

export type DeleteBankAccountMutationArgs = {
	companyId: string;
	moduleCode: string;
	supplierId: string;
	bankAccountId: string;
};