import type { PositionItemDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-positions-res";
import type { PositionLayout } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/position-shape/position-shape.types";

/** Layout de un cuadrito (posición) dentro del shape padre, en metros. */
export type PositionCellLayout = {
	positionId: string;
	offsetXMeters: number;
	offsetYMeters: number;
	cellWidthMeters: number;
	cellDepthMeters: number;
	hasRegisteredCoordinates: boolean;
	status: string | number;
};

/** Código de tramo: `{lotCode}-F{row}C{column}` */
export const parseLotPositionCode = (
	positionCode: string,
): { row: number; column: number } | null => {
	const lotCodeMatch = positionCode.match(/-F(\d+)C(\d+)$/i);
	if (!lotCodeMatch) return null;
	return {
		row: Number(lotCodeMatch[1]),
		column: Number(lotCodeMatch[2]),
	};
};

/** Código de rack: `{rackCode}-N{level}P{column}` */
export const parseRackPositionCode = (
	positionCode: string,
): { level: number; column: number } | null => {
	const rackCodeMatch = positionCode.match(/-N(\d+)P(\d+)$/i);
	if (!rackCodeMatch) return null;
	return {
		level: Number(rackCodeMatch[1]),
		column: Number(rackCodeMatch[2]),
	};
};

const clampBetween = (value: number, minimum: number, maximum: number) =>
	Math.max(minimum, Math.min(maximum, value));

export type BuildPositionCellLayoutsInput = {
	positions: PositionItemDto[];
	layout: PositionLayout;
	/** Ancho del tramo/rack contenedor (metros). */
	containerWidthMeters: number;
	/** Largo del tramo/rack contenedor (metros). */
	containerLengthMeters: number;
	/** Ancho estándar del polín/celda (metros). */
	standardCellWidthMeters: number;
	/** Profundidad estándar del polín/celda (metros). */
	standardCellDepthMeters: number;
	/** Niveles a incluir. Default: solo piso (1). `null` = todos. */
	levelsToShow?: number[] | null;
};

/**
 * Calcula dónde dibujar cada posición dentro del shape:
 * - con coordinates → usa X/Y como centro de la celda
 * - sin coordinates → proyecta grilla desde el código (FrowCcol / NlevelPcol)
 */
export const buildPositionCellLayouts = (
	input: BuildPositionCellLayoutsInput,
): PositionCellLayout[] => {
	const {
		positions,
		layout,
		containerWidthMeters,
		containerLengthMeters,
		standardCellWidthMeters,
		standardCellDepthMeters,
		levelsToShow = [1],
	} = input;

	const positionsForSelectedLevels =
		levelsToShow == null
			? positions
			: positions.filter((position) =>
					levelsToShow.includes(Number(position.level)),
				);

	const rackColumnNumbers = positionsForSelectedLevels
		.map(
			(position) => parseRackPositionCode(position.code)?.column ?? 0,
		)
		.filter((columnNumber) => columnNumber > 0);

	const totalRackColumns =
		rackColumnNumbers.length > 0
			? Math.max(...rackColumnNumbers)
			: positionsForSelectedLevels.length || 1;

	const estimatedColumnsPerRow = Math.max(
		1,
		Math.round(containerWidthMeters / standardCellWidthMeters),
	);

	return positionsForSelectedLevels.map((position, positionIndex) => {
		const hasRegisteredCoordinates = position.coordinates != null;
		let cellWidthMeters = standardCellWidthMeters;
		let cellDepthMeters = standardCellDepthMeters;
		let offsetXMeters = 0;
		let offsetYMeters = 0;

		if (hasRegisteredCoordinates && position.coordinates) {
			// Las coordenadas guardadas representan el centro de la celda.
			offsetXMeters =
				position.coordinates.position_x - cellWidthMeters / 2;
			offsetYMeters =
				position.coordinates.position_y - cellDepthMeters / 2;
		} else if (layout === "lot") {
			const lotGridFromCode = parseLotPositionCode(position.code);
			const rowNumber =
				lotGridFromCode?.row ??
				Math.floor(positionIndex / estimatedColumnsPerRow) + 1;
			const columnNumber =
				lotGridFromCode?.column ??
				(positionIndex % estimatedColumnsPerRow) + 1;

			offsetXMeters = (columnNumber - 1) * standardCellWidthMeters;
			offsetYMeters = (rowNumber - 1) * standardCellDepthMeters;
		} else {
			const rackSlotFromCode = parseRackPositionCode(position.code);
			const columnNumber = rackSlotFromCode?.column ?? positionIndex + 1;

			cellWidthMeters = containerWidthMeters / totalRackColumns;
			cellDepthMeters = containerLengthMeters;
			offsetXMeters = (columnNumber - 1) * cellWidthMeters;
			offsetYMeters = 0;
		}

		const maxOffsetXMeters = Math.max(
			containerWidthMeters - cellWidthMeters,
			0,
		);
		const maxOffsetYMeters = Math.max(
			containerLengthMeters - cellDepthMeters,
			0,
		);

		return {
			positionId: position.id,
			offsetXMeters: clampBetween(offsetXMeters, 0, maxOffsetXMeters),
			offsetYMeters: clampBetween(offsetYMeters, 0, maxOffsetYMeters),
			cellWidthMeters: Math.min(cellWidthMeters, containerWidthMeters),
			cellDepthMeters: Math.min(cellDepthMeters, containerLengthMeters),
			hasRegisteredCoordinates,
			status: position.status,
		};
	});
};
