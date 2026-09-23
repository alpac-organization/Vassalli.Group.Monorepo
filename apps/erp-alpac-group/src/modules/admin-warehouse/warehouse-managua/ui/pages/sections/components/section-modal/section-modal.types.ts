import type { RegisterSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-req";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

export interface SectionModalProps {
	isOpen: boolean;
	warehouseId: string;
	section?: SectionDto | null;
	onClose: () => void;
	onSubmit?: (data: RegisterSectionRequest) => void;
}

export type FormValues = {
	code: string;
	section_type: number;
	section_storage_type: number;
	width_metres: number;
	length_metres: number;
	allows_storage_aisle: boolean;
	maximum_number_of_pallets_per_level?: number | null;
};
