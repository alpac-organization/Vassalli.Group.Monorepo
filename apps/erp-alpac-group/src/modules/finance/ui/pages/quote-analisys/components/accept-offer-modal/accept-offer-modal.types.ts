export type AcceptOfferModalProps = {
	isOpen: boolean;
	supplierName: string;
	isSubmitting?: boolean;
	onClose: () => void;
	onConfirm: (justification: string) => void;
};
