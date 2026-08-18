import type { GetServiceOrdersResponse } from "@app/modules/service-order/domain/ApiContract/Responses/service-order-responses/get-service-orders.response";

export type SelectServiceOrderModalProps = {
	isOpen: boolean;
	selectionType?: "single" | "multiple";
	onClose: () => void;
	onSelect: (serviceOrders: GetServiceOrdersResponse[]) => void;
};
