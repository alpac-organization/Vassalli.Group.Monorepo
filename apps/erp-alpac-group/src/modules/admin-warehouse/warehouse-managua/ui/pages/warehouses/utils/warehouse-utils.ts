import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import type { WarehouseFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-filters/types/warehouse-filters.types";
import type Konva from "konva";

const STATUS_TO_ACTIVE: Record<string, boolean> = {
	Activa: true,
	Inactiva: false,
};

function toOptionalNumber(value: string): number | undefined {
	if (!value) return undefined;
	const parsed = Number(value);
	return Number.isNaN(parsed) ? undefined : parsed;
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

export const bringToFront = (node: Konva.Node) => {
	if (!node?.getParent()) return;

	node.moveToTop();
	node.getLayer()?.batchDraw();
};

export const sendToBack = (node: Konva.Node) => {
	const parent = node?.getParent();
	if (!parent) return;

	node.moveToBottom();

	// Fondos Rect del mismo padre (ej. área de sección en lots) deben quedar atrás
	const backdrops = parent
		.getChildren()
		.filter((child) => child.getClassName() === "Rect");

	backdrops.forEach((child) => child.moveToBottom());

	node.getLayer()?.batchDraw();
};