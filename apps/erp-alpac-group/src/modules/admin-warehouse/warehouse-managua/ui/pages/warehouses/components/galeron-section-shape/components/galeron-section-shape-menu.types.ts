import type { Dispatch, SetStateAction } from "react";
import type Konva from "konva";
import type { GaleronSectionDto } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/galeron-section-shape.types";

export interface GaleronSectionMenuState {
	x: number;
	y: number;
	section: GaleronSectionDto;
	node: Konva.Node;
}

export interface GaleronSectionShapeMenuProps {
	menu: GaleronSectionMenuState | null;
	setMenu: Dispatch<SetStateAction<GaleronSectionMenuState | null>>;
	onEdit: (section: GaleronSectionDto) => void;
}
