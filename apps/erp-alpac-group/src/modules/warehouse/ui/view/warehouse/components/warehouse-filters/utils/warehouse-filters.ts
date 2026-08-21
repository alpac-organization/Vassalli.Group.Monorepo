import type { Option } from "@alpac/design-system";
import { WarehouseTypeOptions } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { WarehouseFilters } from "@app/modules/warehouse/ui/view/warehouse/types/warehouse.types";

export const WAREHOUSE_TYPE_FILTER_OPTIONS: Option[] = [
  ...WarehouseTypeOptions.map((option) => ({
    value: String(option.value),
    label: option.label,
  })),
];

export const STATUS_FILTER_OPTIONS: Option[] = [
  { value: "Activa", label: "Activa" },
  { value: "Inactiva", label: "Inactiva" },
];

export function buildFiltersPayload(
  values: WarehouseFilters,
): WarehouseFilters {
  return {
    warehouse_code: values.warehouse_code.trim(),
    warehouse_type: values.warehouse_type,
    filterStatus: values.filterStatus,
  };
}
