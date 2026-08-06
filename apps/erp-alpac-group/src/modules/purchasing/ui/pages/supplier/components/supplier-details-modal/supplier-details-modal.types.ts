import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export interface SupplierDetailsModalProps {
   isOpen: boolean;
	onClose: () => void;
   selectedSupplier?: GetSuppliersResponse | null;
}