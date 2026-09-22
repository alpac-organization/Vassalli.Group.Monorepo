import { Group, Rect, Text } from "react-konva";
import { SECTION_STATUS_COLORS } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import type { SectionShapeProps } from "./section-shape.types";

const DEFAULT_PIXELS_PER_METER = 10;

export const SectionShape = ({
	id,
	code,
	x,
	y,
	width,
	length,
	rotation = 0,
	fill,
	status = "available",
	selected = false,
	pixelsPerMeter = DEFAULT_PIXELS_PER_METER,
	onSelect,
}: SectionShapeProps) => {
	
	const pixelX = x * pixelsPerMeter;
	const pixelY = y * pixelsPerMeter;
	const pixelWidth = width * pixelsPerMeter;
	const pixelLength = length * pixelsPerMeter;
	const fillColor = fill ?? SECTION_STATUS_COLORS[status];

	return (
		<Group
			id={id}
			x={pixelX}
			y={pixelY}
			rotation={rotation}
			onClick={() => onSelect?.(id)}
			onTap={() => onSelect?.(id)}
		>
			<Rect
				width={pixelWidth}
				height={pixelLength}
				fill={fillColor}
				opacity={selected ? 0.9 : 0.55}
				stroke={selected ? "#e2e8f0" : "#94a3b8"}
				strokeWidth={selected ? 2 : 1}
			/>
			{code ? (
				<Text
					text={code}
					width={pixelWidth}
					height={pixelLength}
					align="center"
					verticalAlign="middle"
					fill="#0f172a"
					fontSize={Math.min(12, Math.max(8, pixelWidth / 6))}
					listening={false}
				/>
			) : null}
		</Group>
	);
};
