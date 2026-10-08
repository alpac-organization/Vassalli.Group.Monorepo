import type { CustomerDto } from "@app/modules/customer/domain/ApiContract/Responses/customer-responses/get-customer.response";

export type SelectableCustomer = CustomerDto;

export type SelectCustomerModalProps = {
	isOpen: boolean;
	selectionType?: "single" | "multiple";
	excludeCustomerIds?: string[];
	onClose: () => void;
	onSelect: (customers: SelectableCustomer[]) => void;
};
