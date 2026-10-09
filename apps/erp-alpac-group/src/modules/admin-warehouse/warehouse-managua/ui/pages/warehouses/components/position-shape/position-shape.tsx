import { Group, Rect } from "react-konva";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import { buildPositionCellLayouts } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/position-shape/position-shape.utils";
import type { PositionShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/position-shape/position-shape.types";

/** Tonos amarillos semi-transparentes para diferenciar cada cuadrito. */
const YELLOW_CELL_FILLS = [
	"rgba(250, 204, 21, 0.35)",
	"rgba(234, 179, 8, 0.32)",
	"rgba(253, 224, 71, 0.38)",
	"rgba(202, 138, 4, 0.30)",
	"rgba(254, 240, 138, 0.40)",
	"rgba(245, 158, 11, 0.33)",
	"rgba(251, 191, 36, 0.36)",
	"rgba(217, 119, 6, 0.28)",
] as const;

/**
 * Dibuja las posiciones (cuadritos) dentro del Group del tramo/rack.
 * Solo visualización; no intercepta eventos del shape padre.
 */
export const PositionShape = ({
	positions,
	containerWidthM,
	containerLengthM,
	pixelsPerMeter = PIXELS_PER_METER,
	layout = "lot",
	levels = [1],
}: PositionShapeProps) => {
	if (
		positions.length === 0 ||
		containerWidthM <= 0 ||
		containerLengthM <= 0
	) {
		return null;
	}

	const positionCells = buildPositionCellLayouts({
		positions,
		layout,
		containerWidthMeters: containerWidthM,
		containerLengthMeters: containerLengthM,
		levelsToShow: levels,
	});

	return (
		<Group listening={false}>
			{positionCells.map((positionCell, index) => (
				<Rect
					key={positionCell.positionId}
					x={positionCell.offsetXMeters * pixelsPerMeter}
					y={positionCell.offsetYMeters * pixelsPerMeter}
					width={positionCell.cellWidthMeters * pixelsPerMeter}
					height={positionCell.cellDepthMeters * pixelsPerMeter}
					fill={YELLOW_CELL_FILLS[index % YELLOW_CELL_FILLS.length]}
					stroke="rgba(161, 98, 7, 0.55)"
					strokeWidth={0.75}
					cornerRadius={1}
					listening={false}
				/>
			))}
		</Group>
	);
};
