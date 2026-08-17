import type { RackFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/types/racks.types";

export type RacksFiltersProps = {
  onApply: (filters: RackFilters) => void;
  onClear: () => void;
  defaultValues?: RackFilters;
};
