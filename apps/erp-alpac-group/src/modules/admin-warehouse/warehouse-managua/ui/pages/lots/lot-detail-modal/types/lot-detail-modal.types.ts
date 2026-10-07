import type { ReactNode } from "react";
import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";

export interface LotDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	warehouseId: string;
	sectionId: string;
	lot?: LotDto | null;
	isLoading?: boolean;
	title?: string;
	description?: string;
	footer?: ReactNode;
}
