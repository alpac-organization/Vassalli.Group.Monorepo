import type { ContextMenuItem, DatePickerValue } from "@alpac/design-system";

export interface OccasionalMaterialTabProps {
	currentBranchId: string;
	onRequestError: (message?: string) => void;
	onRequestSuccess: (message: string) => void;
}

export type OccasionalMaterialFilterForm = {
	code: string;
	status: number | null;
	date: DatePickerValue
};

const occasionalMaterialContextMenuLabel = {
	edit: "Editar",
	viewDatail: "Ver detalle",
	delete: "Eliminar",
} as const;

export type OccasionalMaterialContextMenu = ContextMenuItem & {
	id: keyof typeof occasionalMaterialContextMenuLabel;
};
