import type { ContextMenuItem, DatePickerValue } from "@alpac/design-system";

export interface MonthlyMaterialTabProps {
	currentBranchId: string;
	onRequestError: (message?: string) => void;
	onRequestSuccess: (message: string) => void;
}

export type MonthlyMaterialFilterForm = {
	code: string;
	status: number | null;
	date: DatePickerValue;
};

const monthlyMaterialContextMenuLabel = {
	edit: "Editar",
	viewDatail: "Ver detalle",
	delete: "Eliminar",
} as const;

export type MonthlyMaterialContextMenu = ContextMenuItem & {
	id: keyof typeof monthlyMaterialContextMenuLabel;
};
