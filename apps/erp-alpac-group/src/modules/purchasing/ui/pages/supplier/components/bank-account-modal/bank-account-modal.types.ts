import type {
	CreateSupplierBankAccountPayload,
	SupplierBankAccount,
} from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";

export interface BankAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (account: CreateSupplierBankAccountPayload) => void;
	editingAccount?: SupplierBankAccount | null;
	isLoading?: boolean;
}
