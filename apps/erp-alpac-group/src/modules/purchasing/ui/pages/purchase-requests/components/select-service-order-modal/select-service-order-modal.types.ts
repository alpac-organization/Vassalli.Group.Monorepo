export type SelectableServiceOrder = {
	service_order_id: string;
	service_order_code: string;
	customer_name: string;
	description: string;
	status: string;
};

export type SelectServiceOrderModalProps = {
	isOpen: boolean;
	selectionType?: "single" | "multiple";
	onClose: () => void;
	onSelect: (serviceOrders: SelectableServiceOrder[]) => void;
};
