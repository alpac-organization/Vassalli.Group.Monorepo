import type { ReactNode } from "react";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

export interface SectionDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	warehouseId: string;
	section?: SectionDto | null;
	isLoading?: boolean;
	title?: string;
	description?: string;
	footer?: ReactNode;
}
