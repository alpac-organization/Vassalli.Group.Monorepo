import { useEffect, useState } from "react";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { WarehouseFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-filters/types/warehouse-filters.types";
import type { Coordinate, Size } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import { MIN_SCALED_MEASURE_PX, PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import type Konva from "konva";

export const metersToPixels = (meters: number) => meters * PIXELS_PER_METER;

export const pixelsToMeters = (pixels: number) => pixels / PIXELS_PER_METER;

export const formatPositionLabel = (xMeters: number, yMeters: number) =>
	`X: ${xMeters.toFixed(2)} m  Y: ${yMeters.toFixed(2)} m`;

export const formatSizeLabel = (widthPx: number, lengthPx: number) =>
	`${pixelsToMeters(widthPx).toFixed(2)} m × ${pixelsToMeters(lengthPx).toFixed(2)} m`;

export const readNodePositionInMeters = (node: Konva.Node) => ({
	x: pixelsToMeters(node.x()),
	y: pixelsToMeters(node.y()),
});

export type ScaledRectMeasure = {
	width: number;
	length: number;
	x: number;
	y: number;
};

export const measureScaledRect = (node: Konva.Rect): ScaledRectMeasure => ({
	width: Math.max(MIN_SCALED_MEASURE_PX, node.width() * node.scaleX()),
	length: Math.max(MIN_SCALED_MEASURE_PX, node.height() * node.scaleY()),
	x: node.x(),
	y: node.y(),
});

export const syncShapeLabel = (label: Konva.Text | null, measure: ScaledRectMeasure) => {
	if (!label) return;

	label.x(measure.x);
	label.y(measure.y);
	label.width(measure.width);
	label.height(measure.length);
};

export const bindShapeTransformer = (
	transformer: Konva.Transformer | null,
	shape: Konva.Rect | null,
	resizable: boolean,
) => {
	if (!transformer) return;

	if (!resizable || !shape) {
		transformer.nodes([]);
		transformer.getLayer()?.batchDraw();
		return;
	}

	transformer.nodes([shape]);
	transformer.moveToTop();
	shape.getParent()?.moveToTop();
	transformer.getLayer()?.batchDraw();
};

export const keepMinimumTransformerBox = <Box extends { width: number; height: number }>(
	oldBox: Box,
	newBox: Box,
	minSize: number,
) => (newBox.width < minSize || newBox.height < minSize ? oldBox : newBox);

type ShapeContextEvent = {
	evt: { preventDefault: () => void; clientX: number; clientY: number };
	cancelBubble: boolean;
	currentTarget: Konva.Node;
};

export const readShapeContextPoint = (event: ShapeContextEvent) => {
	event.evt.preventDefault();
	event.cancelBubble = true;

	return {
		x: event.evt.clientX,
		y: event.evt.clientY,
		node: event.currentTarget,
	};
};

type ShapeSelectEvent = {
	cancelBubble: boolean;
	currentTarget: Konva.Node;
};

export const raiseShape = (event: ShapeSelectEvent) => {
	event.cancelBubble = true;
	event.currentTarget.moveToTop();
};

export const useShapeLayout = (pixelWidth: number, pixelLength: number) => {
	const [size, setSize] = useState<Size>({ width: pixelWidth, length: pixelLength });
	const [layoutLabel, setLayoutLabel] = useState<string | null>(null);
	const [textOffset, setTextOffset] = useState<Coordinate>({ x: 0, y: 0 });

	useEffect(() => {
		setSize({ width: pixelWidth, length: pixelLength });
		setTextOffset({ x: 0, y: 0 });
	}, [pixelWidth, pixelLength]);

	return { size, setSize, layoutLabel, setLayoutLabel, textOffset, setTextOffset };
};

export const dragPositionLabel = (node: Konva.Node) => {
	const position = readNodePositionInMeters(node);
	return {
		label: formatPositionLabel(position.x, position.y),
		x: position.x,
		y: position.y,
	};
};

export const shapeMenuFromEvent = <Data,>(event: ShapeContextEvent, data: Data) => {
	const point = readShapeContextPoint(event);
	return { x: point.x, y: point.y, data, node: point.node };
};

export const selectRaisedShape = <Data,>(
	event: ShapeSelectEvent,
	data: Data,
	onSelect?: (data: Data) => void,
) => {
	raiseShape(event);
	onSelect?.(data);
};

export const applyMeasuredRect = (node: Konva.Rect, label: Konva.Text | null) => {
	const measure = measureScaledRect(node);
	syncShapeLabel(label, measure);

	return {
		size: { width: measure.width, length: measure.length },
		offset: { x: measure.x, y: measure.y },
		label: formatSizeLabel(measure.width, measure.length),
	};
};

export const commitMeasuredRect = (
	node: Konva.Rect | null,
	label: Konva.Text | null,
	setSize: (size: Size) => void,
	setTextOffset: (offset: Coordinate) => void,
	setLayoutLabel: (label: string) => void,
) => {
	if (!node) return;

	const next = applyMeasuredRect(node, label);
	setSize(next.size);
	setTextOffset(next.offset);
	setLayoutLabel(next.label);
};

export const commitShapeDragEnd = (
	node: Konva.Node,
	id: string,
	setLayoutLabel: (label: string | null) => void,
	onCoordinateChange?: (id: string, x: number, y: number) => void,
) => {
	const position = dragPositionLabel(node);
	setLayoutLabel(null);
	onCoordinateChange?.(id, position.x, position.y);
};

export const completeShapeResize = (
	shapeRect: Konva.Rect | null,
	shapeGroup: Konva.Group | null,
	labelText: Konva.Text | null,
) => {
	if (!shapeRect || !shapeGroup) return null;

	const next = applyShapeTransformEnd({
		shapeRect,
		shapeGroup,
		labelText,
		pixelPerMeter: PIXELS_PER_METER,
	});

	return {
		size: { width: next.widthInPixels, length: next.lengthInPixels },
		offset: { x: 0, y: 0 },
		xInMeters: next.xInMeters,
		yInMeters: next.yInMeters,
		widthInMeters: next.widthInMeters,
		lengthInMeters: next.lengthInMeters,
	};
};

export const commitShapeResize = (
	shapeRect: Konva.Rect | null,
	shapeGroup: Konva.Group | null,
	labelText: Konva.Text | null,
	id: string,
	setSize: (size: Size) => void,
	setTextOffset: (offset: Coordinate) => void,
	onCoordinateChange?: (id: string, x: number, y: number) => void,
	onResizeChange?: (id: string, width: number, length: number) => void,
	clearLabel?: () => void,
) => {
	const next = completeShapeResize(shapeRect, shapeGroup, labelText);
	if (!next) return;

	setSize(next.size);
	setTextOffset(next.offset);
	clearLabel?.();
	onCoordinateChange?.(id, next.xInMeters, next.yInMeters);
	onResizeChange?.(id, next.widthInMeters, next.lengthInMeters);
};

export const shapeCaptionProps = (
	offset: Coordinate,
	size: Size,
	fontSize = Math.min(12, Math.max(8, size.width / 6)),
) => ({
	x: offset.x,
	y: offset.y,
	width: size.width,
	height: size.length,
	align: "center" as const,
	verticalAlign: "middle" as const,
	fontSize,
	listening: false as const,
});

export const minimumTransformerBox = (minSize: number) =>
	<Box extends { width: number; height: number }>(oldBox: Box, newBox: Box) =>
		keepMinimumTransformerBox(oldBox, newBox, minSize);

export type ShapeTransformEndResult = {
	xInMeters: number;
	yInMeters: number;
	widthInMeters: number;
	lengthInMeters: number;
	widthInPixels: number;
	lengthInPixels: number;
};

type ApplyShapeTransformEndParams = {
	shapeRect: Konva.Rect;
	shapeGroup: Konva.Group;
	labelText?: Konva.Text | null;
	pixelPerMeter: number;
};

export const applyShapeTransformEnd = ({
	shapeRect,
	shapeGroup,
	labelText,
	pixelPerMeter,
}: ApplyShapeTransformEndParams): ShapeTransformEndResult => {
	
	const horizontalScale = shapeRect.scaleX();
	const verticalScale = shapeRect.scaleY();
	const rectOffsetX = shapeRect.x();
	const rectOffsetY = shapeRect.y();

	shapeRect.scaleX(1);
	shapeRect.scaleY(1);

	const widthInPixels = Math.max(
		pixelPerMeter,
		shapeRect.width() * horizontalScale,
	);

	const lengthInPixels = Math.max(
		pixelPerMeter,
		shapeRect.height() * verticalScale,
	);

	const groupPositionX = shapeGroup.x() + rectOffsetX;
	const groupPositionY = shapeGroup.y() + rectOffsetY;

	shapeGroup.x(groupPositionX);
	shapeGroup.y(groupPositionY);
	shapeRect.x(0);
	shapeRect.y(0);
	shapeRect.width(widthInPixels);
	shapeRect.height(lengthInPixels);

	if (labelText) {
		labelText.x(0);
		labelText.y(0);
		labelText.width(widthInPixels);
		labelText.height(lengthInPixels);
	}

	return {
		xInMeters: groupPositionX / pixelPerMeter,
		yInMeters: groupPositionY / pixelPerMeter,
		widthInMeters: widthInPixels / PIXELS_PER_METER,
		lengthInMeters: lengthInPixels / PIXELS_PER_METER,
		widthInPixels,
		lengthInPixels,
	};
};

const STATUS_TO_ACTIVE: Record<string, boolean> = {
	Activa: true,
	Inactiva: false,
};

function toOptionalNumber(rawValue: string): number | undefined {
	if (!rawValue) return undefined;
	const parsedNumber = Number(rawValue);
	return Number.isNaN(parsedNumber) ? undefined : parsedNumber;
}

export function filtersToGetWarehouseParams(
	filters: WarehouseFilters):
	Pick<GetWarehouseRequest, "warehouse_code" | "warehouse_type" | "is_active"> {

	return {
		warehouse_code: filters.warehouse_code.trim() || undefined,
		warehouse_type: toOptionalNumber(filters.warehouse_type),
		is_active: STATUS_TO_ACTIVE[filters.filterStatus],
	};
}

export const bringToFront = (shapeNode: Konva.Node) => {
	if (!shapeNode?.getParent()) return;

	shapeNode.moveToTop();
	shapeNode.getLayer()?.batchDraw();
};

export const sendToBack = (shapeNode: Konva.Node) => {
	const parentNode = shapeNode?.getParent();
	if (!parentNode) return;

	shapeNode.moveToBottom();

	const backgroundRects = parentNode
		.getChildren()
		.filter((childNode) => childNode.getClassName() === "Rect");

	backgroundRects.forEach((backgroundRect) => backgroundRect.moveToBottom());

	shapeNode.getLayer()?.batchDraw();
};
