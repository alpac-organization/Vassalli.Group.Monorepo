export interface PositionCoordinatesDto {
	position_x: number;
	position_y: number;
	position_z: number;
	rotation_y: number;
}

export interface PositionItemDto {
	id: string;
	code: string;
	level: number;
	status: string | number;
	coordinates: PositionCoordinatesDto | null;
}

export interface PositionBlockDto {
	id: string;
	code: string;
	positions: PositionItemDto[];
}

export interface GetPositionsResponse {
	warehouse_id: string;
	section_id: string;
	section_code: string;
	section_type: string | number;
	section_storage_type: string | number;
	blocks: PositionBlockDto[];
}
