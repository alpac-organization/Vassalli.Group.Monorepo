import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { WarehouseFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-filters/types/warehouse-filters.types";
import { PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import type Konva from "konva";

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
