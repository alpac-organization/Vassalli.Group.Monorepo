import type { GetWarehouseDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-details-response";

export interface WarehouseDetailsDto {
	warehouse_id: string;
	width: number;
	length: number;
	margin_right: number;
	margin_bottom: number;
	margin_left: number;
	margin_top: number;
}

export const mapWarehouseDetailsToLayout = (detail: GetWarehouseDetailsResponse): WarehouseDetailsDto => {

	const capacity = detail.capacity;

	return {
		warehouse_id: detail.warehouse_id,
		width: capacity?.width ?? 0,
		length: capacity?.length ?? 0,
		margin_top: capacity?.margin_top ?? 0,
		margin_bottom: capacity?.margin_bottom ?? 0,
		margin_left: capacity?.margin_left ?? 0,
		margin_right: capacity?.margin_right ?? 0
	};
};

export const getWarehouseOccupancyPercentage = (detail: GetWarehouseDetailsResponse | undefined): number => {
	const available = detail?.capacity?.percentage_available_area_with_margin_m2;
	if (available == null) return 0;
	return Math.round((100 - available) * 100) / 100;
};
