import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { Dispatch, SetStateAction } from "react";
import type Konva from "konva";

export type LotMenuState = {
	x: number;
	y: number;
	lot: LotDto;
	node: Konva.Node;
};

export interface LotShapeMenuProps {
	menu: LotMenuState | null;
	setMenu: Dispatch<SetStateAction<LotMenuState | null>>;
	onEdit: (lot: LotDto) => void;
}
