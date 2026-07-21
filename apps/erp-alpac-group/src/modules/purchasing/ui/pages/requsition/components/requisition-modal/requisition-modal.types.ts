export type RequisitionRow = {
	requisition_id: number;
	requisition_number: string;
	requester_name: string;
	area_name: string;
	request_date: string;
	status: string;
};

export interface RequisitionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: () => void;
	onRequestError?: (message?: string) => void;
	selectedRequisition?: RequisitionRow | null;
}
