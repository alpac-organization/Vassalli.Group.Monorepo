export type SelectBranchModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (branchId: string, branchName: string) => void;
	currentBranchId?: string | null;
};
