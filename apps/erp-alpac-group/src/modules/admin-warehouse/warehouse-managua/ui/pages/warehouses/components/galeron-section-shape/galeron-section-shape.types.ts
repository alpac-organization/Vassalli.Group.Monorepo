import type { Shape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import type { GaleronSectionMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/components/galeron-section-shape-menu.types";

const MOCK_GALERON_ID = "mock-galeron";
const MOCK_GALERON_LENGTH = 12.12;
const MOCK_SIDE_SECTION_WIDTH = 8.85 + 0.6;
const MOCK_CENTER_SECTION_WIDTH = 4.75 + 4.75;

export const createMockGaleronSections = (
	warehouseWidth: number,
	warehouseLength: number,
): GaleronSectionDto[] => {
	const y = warehouseLength;
	const length = MOCK_GALERON_LENGTH;

	return [
		{
			id: "mock-galeron-section-start",
			galeron_id: MOCK_GALERON_ID,
			code: "SG-01",
			x: 0,
			y,
			width: MOCK_SIDE_SECTION_WIDTH,
			length,
		},
		{
			id: "mock-galeron-section-center",
			galeron_id: MOCK_GALERON_ID,
			code: "SG-02",
			x: (warehouseWidth - MOCK_CENTER_SECTION_WIDTH) / 2,
			y,
			width: MOCK_CENTER_SECTION_WIDTH,
			length,
		},
		{
			id: "mock-galeron-section-end",
			galeron_id: MOCK_GALERON_ID,
			code: "SG-03",
			x: warehouseWidth - MOCK_SIDE_SECTION_WIDTH,
			y,
			width: MOCK_SIDE_SECTION_WIDTH,
			length,
		},
	];
};

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
