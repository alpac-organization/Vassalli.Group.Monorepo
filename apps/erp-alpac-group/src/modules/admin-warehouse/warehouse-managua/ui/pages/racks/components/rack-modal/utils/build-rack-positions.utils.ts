import {
	RACK_POSITION_LENGTH_METER,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";

export type BuildRackPositionsInput = {
	/** Ancho del rack (metros). */
	width: number;
	/** Largo del rack (metros). */
	length: number;
	/** Cantidad de polines/posiciones. */
	maxPulleys: number;
	/** Altura del rack/posición (metros) → se guarda en position_z. */
	height?: number;
};

export type RackPositionCoordinate = {
	position_x: number;
	position_y: number;
	position_z: number;
	rotation_y: number;
};

export type BuildRackPositionsResult = {
	fits: boolean;
	message: string;
	positionLength: number;
	positions: RackPositionCoordinate[];
};

const cellCenter = (index: number, size: number) =>
	Number((index * size + size / 2).toFixed(6));

/**
 * Posiciones apiladas a lo largo del largo del rack (2 × 1.22 m en 2.44 m).
 * Reparte `length / maxPulleys`; no usa footprint de polín.
 */
export const buildRackPositions = (
	input: BuildRackPositionsInput,
): BuildRackPositionsResult => {
	const { width, length, maxPulleys, height = 0 } = input;

	const hasValidInput =
		width > 0 &&
		length > 0 &&
		Number.isInteger(maxPulleys) &&
		maxPulleys >= 1;

	const positionLength = hasValidInput ? length / maxPulleys : 0;
	const centerX = hasValidInput ? width / 2 : 0;
	const positionZ =
		Number.isFinite(height) && height >= 0
			? Number(height.toFixed(6))
			: 0;

	const positions = hasValidInput
		? Array.from({ length: maxPulleys }, (_, index) => ({
				position_x: Number(centerX.toFixed(6)),
				position_y: cellCenter(index, positionLength),
				position_z: positionZ,
				rotation_y: 0,
			}))
		: [];

	const message = !hasValidInput
		? "Indique ancho, largo y polines del rack para proyectar posiciones."
		: `${positions.length} posiciones a lo largo de ${length.toFixed(2)} m (cada una ${positionLength.toFixed(2)} m; ref. ${RACK_POSITION_LENGTH_METER} m).`;

	return {
		fits: hasValidInput,
		message,
		positionLength,
		positions,
	};
};
