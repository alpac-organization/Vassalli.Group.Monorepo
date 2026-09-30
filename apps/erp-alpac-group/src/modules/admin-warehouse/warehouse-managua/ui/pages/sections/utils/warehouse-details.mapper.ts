import type { WarehouseDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/warehouses/get-warehouse-res";
import type { GetWarehouseDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouse-details-response";

export const mapWarehouseDetailsToLayout = (
  detail: GetWarehouseDetailsResponse,
): WarehouseDto => {
  const capacity = detail.capacity;

  return {
    warehouse_id: detail.warehouse_id,
    width: capacity?.width ?? 0,
    length: capacity?.length ?? 0,
    margin_top: capacity?.margin_top ?? 0,
    margin_bottom: capacity?.margin_bottom ?? 0,
    margin_left: capacity?.margin_left ?? 0,
    margin_right: capacity?.margin_right ?? 0,
  };
};

export const getWarehouseOccupancyPercentage = (
  detail: GetWarehouseDetailsResponse | undefined,
): number => {
  const available = detail?.capacity?.percentage_available_area_with_margin_m2;
  if (available == null) return 0;
  return Math.round((100 - available) * 100) / 100;
};
