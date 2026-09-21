import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface DeleteBankAccountRequest extends BaseRequest {
	supplier_id: string;
	bank_account_id: string;
}

export interface GetBankAccountsRequest extends BaseRequest {
	supplier_id: string;
}
