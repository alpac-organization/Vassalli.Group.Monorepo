import type { ReactNode } from "react";
import type { Shape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import type { GaleronMenuState } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/components/galeron-shape-menu.types";

export const createMockGaleron = (
	warehouseWidth: number,
	warehouseLength: number,
): GaleronDto => ({
	id: "mock-galeron",
	name: "Galerón",
	x: 0,
	y: warehouseLength,
	width: warehouseWidth,
	length: 12.12,	
});

export interface GaleronDto {
	id: string;
	name: string;
	x: number;
	y: number;
	width: number;
	length: number;
}

export interface GaleronShapeProps extends Shape<GaleronDto> {
	galeron: GaleronDto;
	children?: ReactNode;
	onContextMenu?: (menu: GaleronMenuState) => void;
}
