export interface SectionModalProps {
	isOpen: boolean;
	warehouseId: string;
	onClose: () => void;
	onSubmit: (data: unknown) => void;
}