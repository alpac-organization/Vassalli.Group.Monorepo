import type { ReactNode } from "react";
import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";

export interface WarehouseDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	warehouse?: WarehouseDto | null;
	isLoading?: boolean;
	title?: string;
	description?: string;
	footer?: ReactNode;
}
