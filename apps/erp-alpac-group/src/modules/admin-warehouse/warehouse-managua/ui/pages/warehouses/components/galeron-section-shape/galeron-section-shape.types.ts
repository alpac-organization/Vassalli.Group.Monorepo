import type { Shape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import type { GaleronSectionMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/components/galeron-section-shape-menu.types";

export interface GaleronSectionDto {
	id: string;
	galeron_id: string;
	code: string;
	x: number;
	y: number;
	width: number;
	length: number;
}

export const GALERON_SECTION_FILL = "#e38a17";
export const GALERON_SECTION_STROKE = "#f7ae4f";

export interface GaleronSectionShapeProps extends Shape<GaleronSectionDto> {
	section: GaleronSectionDto;
	onContextMenu?: (menu: GaleronSectionMenuState) => void;
}
