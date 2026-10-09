import type { LotPositionItem } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";

export type BuildLotPositionsInput = {
	rows: number;
	columns: number;
	lotWidth: number;
	lotLength: number;
	level?: number;
};

export type BuildLotPositionsResult = {
	fits: boolean;
	message: string;
	requiredWidth: number;
	requiredLength: number;
	total: number;
	/** Ancho de cada posición (área del tramo / columnas). */
	positionWidth: number;
	/** Largo de cada posición (área del tramo / filas). */
	positionLength: number;
	positions: LotPositionItem[];
};

const isPositiveInteger = (value: number) =>
	Number.isFinite(value) && Number.isInteger(value) && value >= 1;

const cellCenter = (index: number, size: number) =>
	Number((index * size + size / 2).toFixed(6));

const createPosition = (
	row: number,
	column: number,
	level: number,
	positionWidth: number,
	positionLength: number,
): LotPositionItem => ({
	row,
	column,
	level,
	allows_stocking: true,
	position_code: `P-${row}-${column}`,
	status: "available",
	coordinate: {
		position_x: cellCenter(column, positionWidth),
		position_y: cellCenter(row, positionLength),
		position_z: 0,
		rotation_y: 0,
	},
});

const buildGrid = (
	rows: number,
	columns: number,
	level: number,
	positionWidth: number,
	positionLength: number,
): LotPositionItem[] =>
	Array.from({ length: rows * columns }, (_, index) => {
		const row = Math.floor(index / columns);
		const column = index % columns;
		return createPosition(row, column, level, positionWidth, positionLength);
	});

/**
 * Genera la grilla de posiciones de un tramo: filas × columnas.
 * El width/length de cada posición reparte el área del tramo (no usa footprint de polín).
 */
export const buildPositions = (
	input: BuildLotPositionsInput,
): BuildLotPositionsResult => {
	const {
		rows,
		columns,
		lotWidth,
		lotLength,
		level = 0,
	} = input;

	const hasValidInput =
		isPositiveInteger(rows) &&
		isPositiveInteger(columns) &&
		lotWidth > 0 &&
		lotLength > 0;

	const positionWidth = hasValidInput ? lotWidth / columns : 0;
	const positionLength = hasValidInput ? lotLength / rows : 0;
	const fits = hasValidInput;
	const positions = fits
		? buildGrid(rows, columns, level, positionWidth, positionLength)
		: [];

	const lotLabel = `${lotWidth.toFixed(2)}×${lotLength.toFixed(2)} m`;
	const cellLabel = `${positionWidth.toFixed(2)}×${positionLength.toFixed(2)} m`;

	const message = !hasValidInput
		? "Indique filas, columnas y dimensiones del tramo para proyectar las posiciones."
		: `${positions.length} posiciones (${rows}×${columns}). Cada una: ${cellLabel} sobre el tramo ${lotLabel}.`;

	return {
		fits,
		message,
		requiredWidth: lotWidth,
		requiredLength: lotLength,
		total: positions.length,
		positionWidth,
		positionLength,
		positions,
	};
};
