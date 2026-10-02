import type { ReactNode } from "react";

export type LotsHeaderProps = {
	warehouseId: string;
	sectionId: string;
	sectionCode: string;
	totalArea: number;
	lotQuantity: number;
	registerButton?: ReactNode;
};
