import type { CreateSupplierBankAccountPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateBankAccountRequest extends BaseRequest {
	supplier_id: string;
	payload : CreateSupplierBankAccountPayload;
}
