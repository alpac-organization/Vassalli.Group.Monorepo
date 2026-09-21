export interface SupplierBankAccount {
	id: string;
	bank_name: string;
	account_number: string;
	account_type: string;
	currency: string;
	account_holder_name: string;
	account_holder_identification?: string | null;
	is_primary: boolean;
}

export interface CreateSupplierBankAccountPayload {
	bank_name: string;
	account_number: string;
	account_type: string | number;
	currency: string | number;
	account_holder_name: string;
	account_holder_identification?: string | null;
	is_primary: boolean;
}

export interface UpdateSupplierBankAccountPayload {
	bank_name?: string;
	account_number?: string;
	account_type?: string | number;
	currency?: string | number;
	account_holder_name?: string;
	account_holder_identification?: string | null;
	is_primary?: boolean;
}
