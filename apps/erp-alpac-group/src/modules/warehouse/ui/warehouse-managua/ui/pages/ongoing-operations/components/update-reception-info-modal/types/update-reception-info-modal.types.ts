export interface UpdateReceptionInfoFormValues {
	customer_id: string;
	package_amount: number;
	merchandise_weight: number;
	shipping_company: string;
	consignee: string;
	sender: string;
	is_alerted: boolean;
	merchandises: Array<{
		merchandise: string;
		merchandise_description: string;
	}>;
}

export interface UpdateReceptionInformationModalProps {
	isOpen: boolean;
	onClose: () => void;
	orderId: string | null;
	poCode?: string;
	onSuccess?: () => void;
}
