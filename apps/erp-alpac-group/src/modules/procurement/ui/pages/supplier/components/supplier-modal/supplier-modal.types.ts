import type { CreateSupplierRequest } from "@app/modules/procurement/domain/suppliers/requests/create-supplier-request";
import type { UpdateSupplierRequest } from "@app/modules/procurement/domain/suppliers/requests/update-suppliers-request";
import type { GetSuppliersResponse } from "@app/modules/procurement/domain/suppliers/responses/get-suppliers-response";

export interface SupplierModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (data: CreateSupplierRequest | UpdateSupplierRequest) => void;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
	selectedSupplier?: GetSuppliersResponse | null;
}
