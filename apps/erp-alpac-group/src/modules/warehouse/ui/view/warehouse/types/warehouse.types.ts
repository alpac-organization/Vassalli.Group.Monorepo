import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";

export type WarehouseFilters = {
  warehouse_code: string;
  warehouse_type: string;
  filterStatus: string;
};

export const EMPTY_WAREHOUSE_FILTERS: WarehouseFilters = {
  warehouse_code: "",
  warehouse_type: "",
  filterStatus: "",
};

export function filtersToGetWarehouseParams(
  filters: WarehouseFilters,
): Pick<
  GetWarehouseRequest,
  "warehouse_code" | "warehouse_type" | "is_active"
> {
  const warehouseType = filters.warehouse_type
    ? Number(filters.warehouse_type)
    : undefined;

  return {
    warehouse_code: filters.warehouse_code.trim() || undefined,
    warehouse_type:
      warehouseType != null && !Number.isNaN(warehouseType)
        ? warehouseType
        : undefined,
    is_active:
      filters.filterStatus === "Activa"
        ? true
        : filters.filterStatus === "Inactiva"
          ? false
          : undefined,
  };
}
