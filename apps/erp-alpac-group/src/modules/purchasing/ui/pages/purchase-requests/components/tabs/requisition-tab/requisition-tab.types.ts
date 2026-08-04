import type { ContextMenuItem } from "@alpac/design-system";

export interface RequisitionTabProps {
   currentBranchId: string;
   onRequestError: (message?: string) => void;
   onRequestSuccess: (message: string) => void;
}

const requisitionContextMenuLabel = {
   edit: "Editar",
   viewDatail: "Ver detalle",
   delete: "Eliminar",   
} as const;

export type RequisitionContextMenu = ContextMenuItem & {
   id: keyof typeof requisitionContextMenuLabel;   
}