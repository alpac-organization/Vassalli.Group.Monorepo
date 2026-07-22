export type RequisitionItem = {
	product_id?: string;
	description: string;
	quantity: string;
	unit: string;
	product_category: string;
};

export type RequisitionItems = {
	requisition_items: RequisitionItem[]
}

export type RequisitionRow = {
	requisition_id: number;
	requisition_number: string;
	requester_name: string;
	area_id: string;
	cost_center_id: string;
	request_date: string;
	required_date: string;
	status: string;
	items: RequisitionItem[];
};

export interface RequisitionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: () => void;
	onRequestError?: (message?: string) => void;
	selectedRequisition?: RequisitionRow | null;
}
