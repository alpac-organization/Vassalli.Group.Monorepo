export interface GaleronModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (width: number, length: number) => void;
}

export type GaleronFormValues = {
	width?: number;
	length?:  number;
};
