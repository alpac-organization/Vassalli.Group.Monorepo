import type {
	CreateSupplierBankAccountPayload,
	SupplierBankAccount,
} from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";

export interface BankAccountListProps {
	accounts: (SupplierBankAccount | CreateSupplierBankAccountPayload)[];
	onAddAccount: (account: CreateSupplierBankAccountPayload) => void;
	onEditAccount?: (account: SupplierBankAccount | CreateSupplierBankAccountPayload, index: number) => void;
	onDeleteAccount: (account: SupplierBankAccount | CreateSupplierBankAccountPayload, index: number) => void;
	onSetPrimary?: (account: SupplierBankAccount | CreateSupplierBankAccountPayload, index: number) => void;
	isLoading?: boolean;
	readOnly?: boolean;
}
