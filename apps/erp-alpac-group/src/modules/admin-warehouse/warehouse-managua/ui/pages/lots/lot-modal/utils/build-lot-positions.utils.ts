import type { LotPositionItem } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";

/** Footprint estándar de polín en metros (ancho × largo). */
export const STANDARD_POLIN_WIDTH = 1.0;
export const STANDARD_POLIN_DEPTH = 1.8;

export type BuildLotPositionsInput = {
	rows: number;
	columns: number;
	lotWidth: number;
	lotLength: number;
	polinWidth?: number;
	polinDepth?: number;
	level?: number;
};

export type BuildLotPositionsResult = {
	fits: boolean;
	message: string;
	requiredWidth: number;
	requiredLength: number;
	total: number;
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
	polinWidth: number,
	polinDepth: number,
): LotPositionItem => ({
	row,
	column,
	level,
	allows_stocking: true,
	position_code: `P-${row}-${column}`,
	status: "available",
	coordinate: {
		position_x: cellCenter(column, polinWidth),
		position_y: cellCenter(row, polinDepth),
		position_z: 0,
		rotation_y: 0,
	},
});

const buildGrid = (
	rows: number,
	columns: number,
	level: number,
	polinWidth: number,
	polinDepth: number,
): LotPositionItem[] =>
	Array.from({ length: rows * columns }, (_, index) => {
		const row = Math.floor(index / columns);
		const column = index % columns;
		return createPosition(row, column, level, polinWidth, polinDepth);
	});

type PositionsMessageInput = {
	fits: boolean;
	hasValidInput: boolean;
	rows: number;
	columns: number;
	polinWidth: number;
	polinDepth: number;
	requiredWidth: number;
	requiredLength: number;
	lotWidth: number;
	lotLength: number;
	total: number;
};

const buildMessage = ({
	fits,
	hasValidInput,
	rows,
	columns,
	polinWidth,
	polinDepth,
	requiredWidth,
	requiredLength,
	lotWidth,
	lotLength,
	total,
}: PositionsMessageInput): string => {
	if (!hasValidInput) {
		return "Indique filas, columnas y dimensiones del tramo para proyectar las posiciones.";
	}

	const polinLabel = `${polinWidth.toFixed(2)}×${polinDepth.toFixed(2)} m`;
	const requiredLabel = `${requiredWidth.toFixed(2)}×${requiredLength.toFixed(2)} m`;
	const lotLabel = `${lotWidth.toFixed(2)}×${lotLength.toFixed(2)} m`;

	if (fits) {
		return `${total} posiciones (${rows}×${columns}) con polín ${polinLabel}. Requerido: ${requiredLabel} de ${lotLabel}.`;
	}

	return `La matriz ${rows}×${columns} requiere ${requiredLabel} y excede el tramo (${lotLabel}) con polín ${polinLabel}.`;
};

/**
 * Genera la grilla de posiciones (polines) de un tramo: filas × columnas.
 * Coordenadas relativas al origen del tramo, centradas en cada celda del polín.
 */
export const buildPositions = (
	input: BuildLotPositionsInput,
): BuildLotPositionsResult => {
	const {
		rows,
		columns,
		lotWidth,
		lotLength,
		polinWidth = STANDARD_POLIN_WIDTH,
		polinDepth = STANDARD_POLIN_DEPTH,
		level = 0,
	} = input;

	const requiredWidth = columns * polinWidth;
	const requiredLength = rows * polinDepth;
	const hasValidInput =
		isPositiveInteger(rows) &&
		isPositiveInteger(columns) &&
		lotWidth > 0 &&
		lotLength > 0;
	const fits =
		hasValidInput &&
		requiredWidth <= lotWidth + 0.001 &&
		requiredLength <= lotLength + 0.001;
	const positions = fits
		? buildGrid(rows, columns, level, polinWidth, polinDepth)
		: [];

	return {
		fits,
		message: buildMessage({
			fits,
			hasValidInput,
			rows,
			columns,
			polinWidth,
			polinDepth,
			requiredWidth,
			requiredLength,
			lotWidth,
			lotLength,
			total: positions.length,
		}),
		requiredWidth,
		requiredLength,
		total: positions.length,
		positions,
	};
};
