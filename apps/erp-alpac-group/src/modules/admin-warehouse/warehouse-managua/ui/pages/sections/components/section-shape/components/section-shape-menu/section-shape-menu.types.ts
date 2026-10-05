import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { Dispatch, SetStateAction } from "react";
import type Konva from "konva";

export type SectionMenuState = {
	x: number;
	y: number;
	section: SectionDto;
	node: Konva.Node;
};

export interface SectionShapeMenuProps {
	menu: SectionMenuState | null;
	setMenu: Dispatch<SetStateAction<SectionMenuState | null>>;
	onEdit: (section: SectionDto) => void;
};
