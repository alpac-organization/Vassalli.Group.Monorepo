import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";

export type SelectSupplierModalProps = {
   isOpen: boolean;
   selectionType?: "single" | "multiple";
   excludeSupplierIds?: string[];
   onClose: () => void;
   onSelect: (suppliers: GetSuppliersResponse[]) => void;
};