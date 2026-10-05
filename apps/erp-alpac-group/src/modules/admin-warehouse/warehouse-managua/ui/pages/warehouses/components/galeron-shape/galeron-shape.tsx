import { useEffect, useRef, useState } from "react";
import { Group, Label, Rect, Tag, Text, Transformer } from "react-konva";
import type Konva from "konva";
import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import type { GaleronShapeProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/galeron-shape.types";

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

	const pixelX = x * PIXELS_PER_METER;
	const pixelY = y * PIXELS_PER_METER;
	const pixelWidth = width * PIXELS_PER_METER;
	const pixelLength = length * PIXELS_PER_METER;

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
	}, [resizable, selected, galeron.id]);

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
					const metersX = e.target.x() / PIXELS_PER_METER;
					const metersY = e.target.y() / PIXELS_PER_METER;
					setLayoutLabel(`X: ${metersX.toFixed(2)} m  Y: ${metersY.toFixed(2)} m`);
				}}
				onDragEnd={(e) => {
					const metersX = e.target.x() / PIXELS_PER_METER;
					const metersY = e.target.y() / PIXELS_PER_METER;
					setLayoutLabel(null);
					onCoordinateChange?.(galeron.id, metersX, metersY);
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
					event.evt.preventDefault();
					event.cancelBubble = true;
					onContextMenu?.({
						x: event.evt.clientX,
						y: event.evt.clientY,
						galeronData: galeron,
						galeronNode: event.currentTarget
					});
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
					fill={fill}
					opacity={selected ? 0.85 : 0.55}
					stroke={selected ? "#0369a1" : strokeColor}
					strokeWidth={selected ? 2 : 1}
					onTransform={() => {
						const node = shapeRef.current;
						if (!node) return;
						syncTextWithRect(node);

						const scaleX = node.scaleX();
						const scaleY = node.scaleY();
						const newWidthPx = Math.max(10, node.width() * scaleX);
						const newLengthPx = Math.max(10, node.height() * scaleY);

						setLayoutLabel(
							`${(newWidthPx / PIXELS_PER_METER).toFixed(2)} m × ${(newLengthPx / PIXELS_PER_METER).toFixed(2)} m`,
						);
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

						const newWidthPx = Math.max(PIXELS_PER_METER, node.width() * scaleX);
						const newLengthPx = Math.max(PIXELS_PER_METER, node.height() * scaleY);
						const newWidth = newWidthPx / PIXELS_PER_METER;
						const newLength = newLengthPx / PIXELS_PER_METER;
						const nextGroupX = group.x() + offsetX;
						const nextGroupY = group.y() + offsetY;

						group.x(nextGroupX);
						group.y(nextGroupY);
						node.x(0);
						node.y(0);
						node.width(newWidthPx);
						node.height(newLengthPx);

						setSize({ width: newWidthPx, length: newLengthPx });
						setTextOffset({ x: 0, y: 0 });
						setLayoutLabel(null);

						const text = textRef.current;
						if (text) {
							text.x(0);
							text.y(0);
							text.width(newWidthPx);
							text.height(newLengthPx);
						}

						onCoordinateChange?.(
							galeron.id,
							nextGroupX / PIXELS_PER_METER,
							nextGroupY / PIXELS_PER_METER,
						);
						onResizeChange?.(galeron.id, newWidth, newLength);
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
						newBox.width < PIXELS_PER_METER || newBox.height < PIXELS_PER_METER
							? oldBox
							: newBox
					}
				/>
			)}
		</>
	);
};
