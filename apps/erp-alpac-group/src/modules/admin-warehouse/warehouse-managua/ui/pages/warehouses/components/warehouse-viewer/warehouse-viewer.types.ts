import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";

export type WarehouseViewerHandle = {
	addGaleron: (width: number, length: number) => void;
};

export type GaleronLayoutUpdate = {
	galeron_id: string;
	position_x: number;
	position_y: number;
	width: number;
	length: number;
};

export type GaleronSectionLayoutUpdate = {
	section_id: string;
	galeron_id: string;
	position_x: number;
	position_y: number;
	width: number;
	length: number;
};

export interface WarehouseViewerProps {
	className?: string;
	warehouse?: WarehouseDto | null;
	onSaveGaleronLayout?: (payload: GaleronLayoutUpdate) => void;
	onSaveGaleronSectionLayout?: (payload: GaleronSectionLayoutUpdate) => void;
}
