import type { WarehouseFilters } from "@app/modules/warehouse/ui/view/warehouse/types/warehouse.types";

export type WarehouseFiltersProps = {
  onApply: (filters: WarehouseFilters) => void;
  onClear: () => void;
  defaultValues?: WarehouseFilters;
};
