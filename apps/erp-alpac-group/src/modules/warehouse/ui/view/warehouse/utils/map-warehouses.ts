import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { WarehouseFilters } from "@app/modules/warehouse/ui/view/warehouse/types/warehouse.types";

export function normalizeWarehouses(payload: unknown): GetWarehousesResponse[] {
  const list: unknown[] = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown })?.data)
      ? (payload as { data: unknown[] }).data
      : [];

  return list.map((item) => {
    const warehouse = item as Partial<GetWarehousesResponse>;

    return {
      warehouse_id: warehouse.warehouse_id ?? "",
      warehouse_name: warehouse.warehouse_name ?? "-",
      warehouse_code: warehouse.warehouse_code ?? "-",
      warehouse_type: warehouse.warehouse_type ?? "-",
      is_active: Boolean(warehouse.is_active),
    };
  });
}

export function filterWarehouses(
  warehouses: GetWarehousesResponse[],
  filters: WarehouseFilters,
): GetWarehousesResponse[] {
  const search = filters.searchTerm.toLowerCase();

  return warehouses.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.warehouse_name.toLowerCase().includes(search) ||
      item.warehouse_code.toLowerCase().includes(search);

    const matchesType =
      filters.filterType === "" || item.warehouse_type === filters.filterType;

    let matchesStatus = true;
    if (filters.filterStatus === "Activa") {
      matchesStatus = item.is_active === true;
    } else if (filters.filterStatus === "Inactiva") {
      matchesStatus = item.is_active === false;
    }

    return matchesSearch && matchesType && matchesStatus;
  });
}
