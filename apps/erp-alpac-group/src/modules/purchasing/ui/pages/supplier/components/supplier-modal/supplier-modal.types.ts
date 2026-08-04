import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/create-supplier-response";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export interface SupplierModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (data: CreatedSupplierDto) => void;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
	selectedSupplier?: GetSuppliersResponse | null;
}

export interface CreatedSupplierDto {
	data: CreateSupplierResponse;
	supplier_name: string;
}