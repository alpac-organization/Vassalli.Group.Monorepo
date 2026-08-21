import type { SectionFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/types/sections.types";

export type SectionsFiltersProps = {
  onApply: (filters: SectionFilters) => void;
  onClear: () => void;
  defaultValues?: SectionFilters;
};
