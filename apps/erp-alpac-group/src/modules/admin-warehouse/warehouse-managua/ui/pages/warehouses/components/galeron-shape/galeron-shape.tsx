import { useEffect, useRef } from "react";
import type Konva from "konva";
import { Group, Rect, Text, Transformer } from "react-konva";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import type { GaleronShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape.types";
import {
	bindShapeTransformer,
	commitMeasuredRect,
	commitShapeDragEnd,
	commitShapeResize,
	dragPositionLabel,
	metersToPixels,
	minimumTransformerBox,
	readShapeContextPoint,
	shapeCaptionProps,
	useShapeLayout,
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

	const { size, setSize, layoutLabel, setLayoutLabel, textOffset, setTextOffset } = useShapeLayout(pixelWidth, pixelLength);

	useEffect(() => {
		bindShapeTransformer(transformRef.current, shapeRef.current, resizable);
	}, [resizable, selected, galeron.id]);

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
				onDragMove={(e) => setLayoutLabel(dragPositionLabel(e.target).label)}
				onDragEnd={(e) => commitShapeDragEnd(e.target, galeron.id, setLayoutLabel, onCoordinateChange)}
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
					onTransform={() => commitMeasuredRect(shapeRef.current, textRef.current, setSize, setTextOffset, setLayoutLabel)}
					onTransformEnd={() => commitShapeResize(
						shapeRef.current,
						groupRef.current,
						textRef.current,
						galeron.id,
						setSize,
						setTextOffset,
						onCoordinateChange,
						onResizeChange,
						() => setLayoutLabel(null),
					)}
				/>

				<Text
					ref={textRef}
					text={galeron.name}
					fill="#f8fafc"
					{...shapeCaptionProps(textOffset, size, Math.min(14, Math.max(10, size.width / 8)))}
				/>
				{children ?? null}
			</Group>

			{resizable && (
				<Transformer
					ref={transformRef}
					rotateEnabled={false}
					boundBoxFunc={minimumTransformerBox(PIXELS_PER_METER)}
				/>
			)}
		</>
	);
};
