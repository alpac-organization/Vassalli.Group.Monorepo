export interface RackModalProps {
	isOpen: boolean;
	sectionId: string;
	onClose: () => void;
	onSubmit: (data: unknown) => void;
}