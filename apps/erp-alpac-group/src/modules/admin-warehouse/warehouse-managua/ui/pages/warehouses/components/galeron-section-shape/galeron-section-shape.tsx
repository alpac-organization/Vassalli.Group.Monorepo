import { Group, Rect, Text, Transformer } from "react-konva";
import { useEffect, useRef } from "react";
import type Konva from "konva";
import type { GaleronSectionShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/galeron-section-shape.types";
import {
	GALERON_SECTION_FILL,
	GALERON_SECTION_STROKE,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-section-shape/galeron-section-shape.types";
import {
	bindShapeTransformer,
	commitMeasuredRect,
	commitShapeDragEnd,
	commitShapeResize,
	dragPositionLabel,
	metersToPixels,
	minimumTransformerBox,
	selectRaisedShape,
	shapeCaptionProps,
	shapeMenuFromEvent,
	useShapeLayout,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/utils/warehouse-utils";
import { ShapeLayoutLabel } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/shape-layout-label/shape-layout-label";

export const GaleronSectionShape = ({
	x,
	y,
	width,
	length,
	rotation = 0,
	fill = GALERON_SECTION_FILL,
	strokeColor = GALERON_SECTION_STROKE,
	selected = false,
	section,
	draggable,
	resizable,
	onSelect,
	onContextMenu,
	onCoordinateChange,
	onResizeChange,
}: GaleronSectionShapeProps) => {

	const pixelX = metersToPixels(x);
	const pixelY = metersToPixels(y);
	const pixelWidth = metersToPixels(width);
	const pixelLength = metersToPixels(length);

	const groupRef = useRef<Konva.Group>(null);
	const shapeRef = useRef<Konva.Rect>(null);
	const textRef = useRef<Konva.Text>(null);
	const transformRef = useRef<Konva.Transformer>(null);

	const { size, setSize, layoutLabel, setLayoutLabel, textOffset, setTextOffset } = useShapeLayout(pixelWidth, pixelLength);

	useEffect(() => {
		bindShapeTransformer(transformRef.current, shapeRef.current, Boolean(resizable));
	}, [resizable, selected]);

	return (
		<>
			<Group
				ref={groupRef}
				id={section.id}
				x={pixelX}
				y={pixelY}
				rotation={rotation}
				draggable={draggable}
				onDragMove={(e) => setLayoutLabel(dragPositionLabel(e.target).label)}
				onDragEnd={(e) => commitShapeDragEnd(e.target, section.id, setLayoutLabel, onCoordinateChange)}
				onContextMenu={(e) => onContextMenu?.(shapeMenuFromEvent(e, section))}
				onClick={(e) => selectRaisedShape(e, section, onSelect)}
				onTap={(e) => selectRaisedShape(e, section, onSelect)}
			>
				{resizable && layoutLabel && (
					<ShapeLayoutLabel x={textOffset.x} y={textOffset.y} text={layoutLabel} />
				)}

				<Rect
					ref={shapeRef}
					width={pixelWidth}
					height={pixelLength}
					fill={fill}
					opacity={selected ? 1 : 0.7}
					stroke={selected ? strokeColor : "#94a3b8"}
					strokeWidth={selected ? 2 : 1}
					onTransform={() => commitMeasuredRect(shapeRef.current, textRef.current, setSize, setTextOffset, setLayoutLabel)}
					onTransformEnd={() => commitShapeResize(
						shapeRef.current,
						groupRef.current,
						textRef.current,
						section.id,
						setSize,
						setTextOffset,
						onCoordinateChange,
						onResizeChange,
					)}
				/>

				<Text
					ref={textRef}
					text={section.code}
					fill="#0f172a"
					{...shapeCaptionProps(textOffset, size)}
				/>
			</Group>

			{resizable && (
				<Transformer
					ref={transformRef}
					rotateEnabled={false}
					boundBoxFunc={minimumTransformerBox(10)}
				/>
			)}
		</>
	);
};
