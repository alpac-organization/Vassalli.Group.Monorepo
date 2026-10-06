import { Group, Rect, Text, Transformer } from "react-konva";
import type { SectionShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-shape/section-shape.types";
import { useEffect, useRef } from "react";
import type Konva from "konva";
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

export const SectionShape = ({
	x,
	y,
	width,
	length,
	rotation = 0,
	fill,
	strokeColor,
	selected = false,
	section,
	draggable,
	resizable,
	onSelect,
	onContextMenu,
	onCoordinateChange,
	onResizeChange,
}: SectionShapeProps) => {

	const pixelX = metersToPixels(x);
	const pixelY = metersToPixels(y);
	const pixelWidth = metersToPixels(width);
	const pixelLength = metersToPixels(length);
	const fillColor = fill;;

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
				id={section.section_id}
				x={pixelX}
				y={pixelY}
				rotation={rotation}
				draggable={draggable}
				onDragMove={(e) => setLayoutLabel(dragPositionLabel(e.target).label)}
				onDragEnd={(e) => commitShapeDragEnd(e.target, section.section_id, setLayoutLabel, onCoordinateChange)}
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
					fill={fillColor}
					opacity={selected ? 1 : 0.4}
					stroke={selected ? strokeColor : "#94a3b8"}
					strokeWidth={selected ? 2 : 1}
					onTransform={() => commitMeasuredRect(shapeRef.current, textRef.current, setSize, setTextOffset, setLayoutLabel)}
					onTransformEnd={() => commitShapeResize(
						shapeRef.current,
						groupRef.current,
						textRef.current,
						section.section_id,
						setSize,
						setTextOffset,
						onCoordinateChange,
						onResizeChange,
					)}
				/>

				{section.section_code ? (
					<Text
						ref={textRef}
						text={section.section_code}
						fill="#0f172a"
						{...shapeCaptionProps(textOffset, size)}
					/>
				) : null}

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
