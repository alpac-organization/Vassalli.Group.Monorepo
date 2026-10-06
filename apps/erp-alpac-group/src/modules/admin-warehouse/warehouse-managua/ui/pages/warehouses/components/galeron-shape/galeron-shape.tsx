import { useEffect, useRef, useState } from "react";
import { Group, Rect, Text, Transformer } from "react-konva";
import type Konva from "konva";
import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import type { GaleronShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape.types";
import {
	applyShapeTransformEnd,
	bindShapeTransformer,
	formatPositionLabel,
	formatSizeLabel,
	keepMinimumTransformerBox,
	measureScaledRect,
	metersToPixels,
	readNodePositionInMeters,
	readShapeContextPoint,
	syncShapeLabel,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/utils/warehouse-utils";
import { ShapeLayoutLabel } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/shape-layout-label/shape-layout-label";

export const GALERON_FILL = "#0a86bf";

export const GaleronShape = ({
	galeron,
	x,
	y,
	width,
	length,
	rotation = 0,
	fill = GALERON_FILL,
	strokeColor = "#94a3b8",
	selected = false,
	draggable = false,
	resizable = false,
	onSelect,
	onCoordinateChange,
	onResizeChange,
	onContextMenu,
	children,
}: GaleronShapeProps) => {
	const groupRef = useRef<Konva.Group>(null);
	const shapeRef = useRef<Konva.Rect>(null);
	const textRef = useRef<Konva.Text>(null);
	const transformRef = useRef<Konva.Transformer>(null);

	const pixelX = metersToPixels(x);
	const pixelY = metersToPixels(y);
	const pixelWidth = metersToPixels(width);
	const pixelLength = metersToPixels(length);

	const [size, setSize] = useState<Size>({ width: pixelWidth, length: pixelLength });
	const [layoutLabel, setLayoutLabel] = useState<string | null>(null);
	const [textOffset, setTextOffset] = useState<Coordinate>({ x: 0, y: 0 });

	useEffect(() => {
		setSize({ width: pixelWidth, length: pixelLength });
		setTextOffset({ x: 0, y: 0 });
	}, [pixelWidth, pixelLength]);

	useEffect(() => {
		bindShapeTransformer(transformRef.current, shapeRef.current, resizable);
	}, [resizable, selected, galeron.id]);

	const syncTextWithRect = (node: Konva.Rect) => {
		const measure = measureScaledRect(node);
		setSize({ width: measure.width, length: measure.length });
		setTextOffset({ x: measure.x, y: measure.y });
		syncShapeLabel(textRef.current, measure);
		return measure;
	};

	return (
		<>
			<Group
				id={galeron.id}
				ref={groupRef}
				x={pixelX}
				y={pixelY}
				rotation={rotation}
				draggable={draggable}
				onMouseDown={(event) => {
					event.cancelBubble = true;
				}}
				onDragMove={(e) => {
					const position = readNodePositionInMeters(e.target);
					setLayoutLabel(formatPositionLabel(position.x, position.y));
				}}
				onDragEnd={(e) => {
					const position = readNodePositionInMeters(e.target);
					setLayoutLabel(null);
					onCoordinateChange?.(galeron.id, position.x, position.y);
				}}
				onClick={(event) => {
					event.cancelBubble = true;
					onSelect?.(galeron);
				}}
				onTap={(event) => {
					event.cancelBubble = true;
					onSelect?.(galeron);
				}}
				onContextMenu={(event) => {
					const point = readShapeContextPoint(event);
					onContextMenu?.({
						x: point.x,
						y: point.y,
						galeronData: galeron,
						galeronNode: point.node,
					});
				}}
			>
				{resizable && layoutLabel && (
					<ShapeLayoutLabel x={textOffset.x} y={textOffset.y} text={layoutLabel} />
				)}

				<Rect
					ref={shapeRef}
					width={pixelWidth}
					height={pixelLength}
					fill={fill}
					opacity={selected ? 0.85 : 0.55}
					stroke={selected ? "#0369a1" : strokeColor}
					strokeWidth={selected ? 2 : 1}
					onTransform={() => {
						const node = shapeRef.current;
						if (!node) return;
						const measure = syncTextWithRect(node);
						setLayoutLabel(formatSizeLabel(measure.width, measure.length));
					}}
					onTransformEnd={() => {
						const node = shapeRef.current;
						const group = groupRef.current;
						if (!node || !group) return;

						const next = applyShapeTransformEnd({
							shapeRect: node,
							shapeGroup: group,
							labelText: textRef.current,
							pixelPerMeter: PIXELS_PER_METER
						});

						setSize({ width: next.widthInPixels, length: next.lengthInPixels });
						setTextOffset({ x: 0, y: 0 });
						setLayoutLabel(null);
						onCoordinateChange?.(galeron.id, next.xInMeters, next.yInMeters);
						onResizeChange?.(galeron.id, next.widthInMeters, next.lengthInMeters);
					}}
				/>

				<Text
					ref={textRef}
					x={textOffset.x}
					y={textOffset.y}
					text={galeron.name}
					width={size.width}
					height={size.length}
					align="center"
					verticalAlign="middle"
					fill="#f8fafc"
					fontSize={Math.min(14, Math.max(10, size.width / 8))}
					listening={false}
				/>
				{children ?? null}
			</Group>

			{resizable && (
				<Transformer
					ref={transformRef}
					rotateEnabled={false}
					boundBoxFunc={(oldBox, newBox) =>
						keepMinimumTransformerBox(oldBox, newBox, PIXELS_PER_METER)
					}
				/>
			)}
		</>
	);
};
