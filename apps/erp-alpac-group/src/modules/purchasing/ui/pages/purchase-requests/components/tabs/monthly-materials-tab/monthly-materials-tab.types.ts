import type { ContextMenuItem } from "@alpac/design-system";

export interface MonthlyMaterialTabProps {
	currentBranchId: string;
	onRequestError: (message?: string) => void;
	onRequestSuccess: (message: string) => void;
}

const monthlyMaterialContextMenuLabel = {
	edit: "Editar",
	viewDatail: "Ver detalle",
	delete: "Eliminar",
} as const;

export type MonthlyMaterialContextMenu = ContextMenuItem & {
	id: keyof typeof monthlyMaterialContextMenuLabel;
};
