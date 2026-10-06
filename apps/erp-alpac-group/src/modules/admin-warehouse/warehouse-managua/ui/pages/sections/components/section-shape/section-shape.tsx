import { Group, Label, Rect, Tag, Text, Transformer } from "react-konva";
import type { SectionShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-shape/section-shape.types";
import { useEffect, useRef, useState } from "react";
import type Konva from "konva";
import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import { applyShapeTransformEnd } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/utils/warehouse-utils";

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

	const pixelX = x * PIXELS_PER_METER;
	const pixelY = y * PIXELS_PER_METER;
	const pixelWidth = width * PIXELS_PER_METER;
	const pixelLength = length * PIXELS_PER_METER;
	const fillColor = fill;;

	const groupRef = useRef<Konva.Group>(null);
	const shapeRef = useRef<Konva.Rect>(null);
	const textRef = useRef<Konva.Text>(null);
	const transformRef = useRef<Konva.Transformer>(null);

	const [size, setSize] = useState<Size>({ width: pixelWidth, length: pixelLength });
	const [layoutLabel, setLayoutLabel] = useState<string | null>(null);
	const [textOffset, setTextOffset] = useState<Coordinate>({ x: 0, y: 0 });

	useEffect(() => {
		setSize({ width: pixelWidth, length: pixelLength });
		setTextOffset({ x: 0, y: 0 });
	}, [pixelWidth, pixelLength]);

	useEffect(() => {
		const transformer = transformRef.current;
		if (!transformer) return;

		if (!resizable) {
			transformer.nodes([]);
			transformer.getLayer()?.batchDraw();
			return;
		}

		const node = shapeRef.current;
		if (!node) return;

		transformer.nodes([node]);
		transformer.moveToTop();
		node.getParent()?.moveToTop();
		transformer.getLayer()?.batchDraw();
	}, [resizable, selected]);

	const syncTextWithRect = (node: Konva.Rect) => {
		const nextSize = {
			width: Math.max(10, node.width() * node.scaleX()),
			length: Math.max(10, node.height() * node.scaleY()),
		};
		const nextOffset = { x: node.x(), y: node.y() };

		setSize(nextSize);
		setTextOffset(nextOffset);

		const text = textRef.current;
		if (text) {
			text.x(nextOffset.x);
			text.y(nextOffset.y);
			text.width(nextSize.width);
			text.height(nextSize.length);
		}
	};

	return (
		<>
			<Group
				ref={groupRef}
				id={section.section_id}
				x={pixelX}
				y={pixelY}
				rotation={rotation}
				draggable={draggable}
				onDragMove={(e) => {
					const metersX = e.target.x() / PIXELS_PER_METER;
					const metersY = e.target.y() / PIXELS_PER_METER;
					setLayoutLabel(`X: ${metersX.toFixed(2)} m  Y: ${metersY.toFixed(2)} m`);
				}}
				onDragEnd={(e) => {
					const metersX = e.target.x() / PIXELS_PER_METER;
					const metersY = e.target.y() / PIXELS_PER_METER;
					setLayoutLabel(null);
					onCoordinateChange?.(section.section_id, metersX, metersY);
				}}
				onContextMenu={(e) => {
					e.evt.preventDefault();
					e.cancelBubble = true;
					onContextMenu?.({
						x: e.evt.clientX,
						y: e.evt.clientY,
						section: section,
						node: e.currentTarget,
					});
				}}
				onClick={(e) => {
					e.cancelBubble = true;
					e.currentTarget.moveToTop();
					onSelect?.(section);
				}}
				onTap={(e) => {
					e.cancelBubble = true;
					e.currentTarget.moveToTop();
					onSelect?.(section);
				}}
			>
				{resizable && layoutLabel && (
					<Label x={textOffset.x} y={textOffset.y - 30}>
						<Tag fill="#0f172a" cornerRadius={4} />
						<Text
							text={layoutLabel}
							fontSize={11}
							fill="#e2e8f0"
							padding={4}
							listening={false}
						/>
					</Label>
				)}

				<Rect
					ref={shapeRef}
					width={pixelWidth}
					height={pixelLength}
					fill={fillColor}
					opacity={selected ? 1 : 0.4}
					stroke={selected ? strokeColor : "#94a3b8"}
					strokeWidth={selected ? 2 : 1}
					onTransform={() => {
						const node = shapeRef.current;
						const group = groupRef.current
						if (!node || !group) return;
						syncTextWithRect(node);

						const scaleX = node.scaleX();
						const scaleY = node.scaleY();

						const newWidthPx = Math.max(10, node.width() * scaleX);
						const newLengthPx = Math.max(10, node.height() * scaleY);
						const newWidth = newWidthPx / PIXELS_PER_METER;
						const newLength = newLengthPx / PIXELS_PER_METER;

						setLayoutLabel(
							`${newWidth.toFixed(2)} m × ${newLength.toFixed(2)} m`
						);
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
						onCoordinateChange?.(
							section.section_id,
							next.xInMeters,
							next.yInMeters,
						);
						onResizeChange?.(
							section.section_id,
							next.widthInMeters,
							next.lengthInMeters,
						);
					}}
				/>

				{section.section_code ? (
					<Text
						ref={textRef}
						x={textOffset.x}
						y={textOffset.y}
						text={section.section_code}
						width={size.width}
						height={size.length}
						align="center"
						verticalAlign="middle"
						fill="#0f172a"
						fontSize={Math.min(12, Math.max(8, size.width / 6))}
						listening={false}
					/>
				) : null}

			</Group>


			{resizable && (
				<Transformer
					ref={transformRef}
					rotateEnabled={false}
					boundBoxFunc={(oldBox, newBox) =>
						newBox.width < 10 || newBox.height < 10 ? oldBox : newBox
					}
				/>
			)}
		</>
	);
};
