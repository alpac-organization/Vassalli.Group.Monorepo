export type SelectableRequisitionProduct = {
	product_id: string;
	product_code: string;
	product_name: string;
	product_category_id: string;
	product_category_name: string;
	unit_measure_id: string;
	unit_measure_name: string;
};

export interface RequisitionItemSelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (products: SelectableRequisitionProduct[]) => void;
	onRequestError?: (message?: string) => void;
	selectedProductId?: string | null;
	selectionType?: "single" | "multiple";
}
