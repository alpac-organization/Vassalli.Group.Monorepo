export interface LotModalProps {
	isOpen: boolean;
	sectionId: string;
	onClose: () => void;
	onSubmit: (data: unknown) => void;
}