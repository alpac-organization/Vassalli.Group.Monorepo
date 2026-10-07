export interface ProductPriceHistoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: string;
	supplierId: string;
	supplierLabel: string;
}
