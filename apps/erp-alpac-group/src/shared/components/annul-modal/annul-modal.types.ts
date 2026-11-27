import type { ReactNode } from "react";

export type AnnulModalScope = 1 | 2;

export interface AnnulPresetReasonItem {
	id: string;
	title: string;
	description?: string;
	value: string;
	icon?: ReactNode;
}

export type AnnulPresetReason = string | AnnulPresetReasonItem;

export interface AnnulModalProps {
	isOpen: boolean;
	title?: string;
	description?: string;
	showScopeSelection?: boolean;
	presetReasons?: readonly AnnulPresetReason[];
	isSubmitting?: boolean;
	confirmButtonLabel?: string;
	confirmButtonVariant?: "primary" | "danger";
	onClose: () => void;
	onConfirm: (data: { scope: AnnulModalScope; reason: string }) => void;
}
