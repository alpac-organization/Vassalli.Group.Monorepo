import type { LotFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/types/lots.types";

export type LotsFiltersProps = {
  onApply: (filters: LotFilters) => void;
  onClear: () => void;
  defaultValues?: LotFilters;
};
