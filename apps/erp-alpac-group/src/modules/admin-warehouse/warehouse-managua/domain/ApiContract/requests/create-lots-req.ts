import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterLotRequest extends BaseRequest {
	warehouse_id: string;
	section_id: string;
	lots: LotItem[];
}

export interface LotPositionCoordinate {
	position_x: number;
	position_y: number;
	position_z: number;
	rotation_y: number;
}

export interface LotPositionItem {
	row: number;
	column: number;
	level: number;
	allows_stocking: boolean;
	position_code: string;
	status: string;
	observations?: string | null;
	coordinate: LotPositionCoordinate;
}

export interface LotItem {
	nominal_rows: number;
	nominal_columns: number;
	width: number;
	length: number;
	position_x: number;
	position_y: number;
	position_z: number;
	rotation_y: number;
	positions: LotPositionItem[];
}
