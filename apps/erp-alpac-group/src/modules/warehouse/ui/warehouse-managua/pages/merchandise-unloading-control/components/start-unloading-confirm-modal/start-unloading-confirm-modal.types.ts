export interface StartUnloadingConfirmModalProps {
	isOpen: boolean;	
	onClose: () => void;
	onConfirm: (merchandiseType: number) => void;
}
