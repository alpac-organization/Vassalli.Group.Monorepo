import type { UpdateSupplierBankAccountPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateBankAccountRequest  extends BaseRequest {
	supplier_id: string;
	bank_account_id: string;
	payload: UpdateSupplierBankAccountPayload;
}
