import { Group, Label, Rect, Tag, Text, Transformer } from "react-konva";
import { SECTION_STATUS_COLORS } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import type { SectionShapeProps } from "./section-shape.types";
import { useEffect, useRef, useState } from "react";
import type Konva from "konva";
import type { Position, Size } from "../../../warehouses-temp/components/warehouse-shape/warehouse-shape.types";

const DEFAULT_PIXELS_PER_METER = 10;

export const SectionShape = ({
	x,
	y,
	width,
	length,
	rotation = 0,
	fill,
	status = "available",
	selected = false,
	pixelsPerMeter = DEFAULT_PIXELS_PER_METER,
	section,
	draggable,
	resizable,
	onSelect,
	onContextMenu,
	onPositionChange,
	onResizeChange,
}: SectionShapeProps) => {
	const pixelX = x * pixelsPerMeter;
	const pixelY = y * pixelsPerMeter;
	const pixelWidth = width * pixelsPerMeter;
	const pixelLength = length * pixelsPerMeter;
	const fillColor = fill ?? SECTION_STATUS_COLORS[status];

	const groupRef = useRef<Konva.Group>(null);
	const shapeRef = useRef<Konva.Rect>(null);
	const textRef = useRef<Konva.Text>(null);
	const transformRef = useRef<Konva.Transformer>(null);

	const [size, setSize] = useState<Size>({ width: pixelWidth, length: pixelLength });
	const [sizeLabel, setSizeLabel] = useState<string | null>(null);
	const [textOffset, setTextOffset] = useState<Position>({ x: 0, y: 0 });

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
				onDragEnd={(e) => {
					onPositionChange?.(
						section.section_id,
						e.target.x() / pixelsPerMeter,
						e.target.y() / pixelsPerMeter,
					);
				}}
				onContextMenu={(e) => {
					e.evt.preventDefault();
					onContextMenu?.({
						x: e.evt.clientX,
						y: e.evt.clientY,
						section: section,
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
				{resizable && sizeLabel && (
					<Label x={textOffset.x} y={textOffset.y - 30}>
						<Tag fill="#0f172a" cornerRadius={4} />
						<Text
							text={sizeLabel}
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
					opacity={selected ? 1 : 0.3}
					stroke={selected ? "#e2e8f0" : "#94a3b8"}
					strokeWidth={selected ? 2 : 1}
					onTransform={() => {
						const node = shapeRef.current;
						if (!node) return;
						syncTextWithRect(node);
					}}
					onTransformEnd={() => {
						const node = shapeRef.current;
						const group = groupRef.current;
						if (!node || !group) return;

						const scaleX = node.scaleX();
						const scaleY = node.scaleY();

						const offsetX = node.x();
						const offsetY = node.y();

						node.scaleX(1);
						node.scaleY(1);

						const newWidthPx = Math.max(10, node.width() * scaleX);
						const newLengthPx = Math.max(10, node.height() * scaleY);
						const newWidth = newWidthPx / pixelsPerMeter;
						const newLength = newLengthPx / pixelsPerMeter;

						const nextGroupX = group.x() + offsetX;
						const nextGroupY = group.y() + offsetY;

						group.x(nextGroupX);
						group.y(nextGroupY);

						node.x(0);
						node.y(0);
						node.width(newWidthPx);
						node.height(newLengthPx);

						setSize({ width: newWidthPx, length: newLengthPx });
						setSizeLabel(`${newWidth.toFixed(2)} m × ${newLength.toFixed(2)} m`);
						setTextOffset({ x: 0, y: 0 });

						const text = textRef.current;
						if (text) {
							text.x(0);
							text.y(0);
							text.width(newWidthPx);
							text.height(newLengthPx);
						}

						onPositionChange?.(
							section.section_id,
							nextGroupX / pixelsPerMeter,
							nextGroupY / pixelsPerMeter,
						);
						onResizeChange?.(section.section_id, newWidth, newLength);
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
