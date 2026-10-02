import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterLotRequest extends BaseRequest {
	warehouse_id: string;
	section_id: string;
	lots: LotItem[];
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
}
