import type { ContextMenuItem, DatePickerValue } from "@alpac/design-system";

export interface RequisitionTabProps {
   currentBranchId: string;
   onRequestError: (message?: string) => void;
   onRequestSuccess: (message: string) => void;
}

export type RequisitionFilterForm = {
	code: string;
	status: number | null;
	date: DatePickerValue,
};

const requisitionContextMenuLabel = {
   edit: "Editar",
   viewDatail: "Ver detalle",
   delete: "Eliminar",   
} as const;

export type RequisitionContextMenu = ContextMenuItem & {
   id: keyof typeof requisitionContextMenuLabel;   
}