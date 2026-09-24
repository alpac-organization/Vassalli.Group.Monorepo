export interface AnnulModalProps {
	isOpen: boolean;
	title?: string;
	description?: string;
	showScopeSelection?: boolean;
	isSubmitting?: boolean;
	confirmButtonLabel?: string;
	confirmButtonVariant?: "primary" | "danger";
	onClose: () => void;
	onConfirm: (data: { scope: number; reason: string }) => void;
}
