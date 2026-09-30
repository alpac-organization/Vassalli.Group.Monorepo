export interface SelectOperationalOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelect: (operationalOrderId: string, serviceOrder: any) => void;
	onCheckOsSelection?: (osId: string) => boolean;
}