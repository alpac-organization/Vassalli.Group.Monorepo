import type { ReactNode } from "react";

export type SectionsHeaderProps = {
	warehouseId: string;
	warehouseCode: string;
	location: string;
	totalArea: number;
	sectionQuantity: number;
	ocuppation: number;
	registerButton?: ReactNode;
};
