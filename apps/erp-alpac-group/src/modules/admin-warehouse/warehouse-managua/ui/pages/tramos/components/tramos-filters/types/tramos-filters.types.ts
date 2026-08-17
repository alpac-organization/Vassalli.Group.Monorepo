import type { TramoFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/types/tramos.types";

export type TramosFiltersProps = {
  onApply: (filters: TramoFilters) => void;
  onClear: () => void;
  defaultValues?: TramoFilters;
};
