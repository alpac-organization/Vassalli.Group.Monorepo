import { CoordinateTargetTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/coordinate-target-type";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

type RegisterCoordinatesBase = BaseRequest & {
	warehouse_id: string;
	section_id: string;
};

export interface RegisterLotCoordinates {
	lot_position_id: string;
	position_x: number;
	position_y: number;
	position_z: number;
	rotation_y: number;
}

export interface RegisterRackCoordinates {
	rack_position_id: string;
	position_x: number;
	position_y: number;
	position_z: number;
	rotation_y: number;
}

/** Payload para coordenadas de posiciones de tramos (`target_type = 1`). */
export type RegisterLotsPositionsCoordinatesRequest = RegisterCoordinatesBase & {
	target_type: typeof CoordinateTargetTypeEnum.LotsPositions.value;
	lot_id: string;
	lots_positions_information: RegisterLotCoordinates[];
	rack_id?: never;
	rack_positions_information?: [];
};

/** Payload para coordenadas de posiciones de racks (`target_type = 2`). */
export type RegisterRackPositionsCoordinatesRequest = RegisterCoordinatesBase & {
	target_type: typeof CoordinateTargetTypeEnum.RackPositions.value;
	rack_id: string;
	rack_positions_information: RegisterRackCoordinates[];
	lot_id?: never;
	lots_positions_information?: [];
};

export type RegisterCoordinatesRequest =
	| RegisterLotsPositionsCoordinatesRequest
	| RegisterRackPositionsCoordinatesRequest;
