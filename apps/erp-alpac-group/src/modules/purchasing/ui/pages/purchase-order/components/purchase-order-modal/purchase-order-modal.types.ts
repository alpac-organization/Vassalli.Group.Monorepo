export type PurchaseOrderRow = {
	purchase_order_id: number;
	order_number: string;
	supplier_name: string;
	order_date: string;
	total_amount: string;
	status: string;
};

export interface PurchaseOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: () => void;
	onRequestError?: (message?: string) => void;
	selectedPurchaseOrder?: PurchaseOrderRow | null;
}
