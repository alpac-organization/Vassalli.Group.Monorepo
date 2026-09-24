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

export type RequisitionContextMenuId = "edit" | "viewDatail" | "annul";

export const requisitionContextMenuLabel: Record<RequisitionContextMenuId, string> = {
   edit: "Editar",
   viewDatail: "Ver detalle",  
   annul: "Anular",
};

export type RequisitionContextMenu = ContextMenuItem & {
   id: RequisitionContextMenuId;   
};