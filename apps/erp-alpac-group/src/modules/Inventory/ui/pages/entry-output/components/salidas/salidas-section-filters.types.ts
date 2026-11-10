import type { SalidasFilters } from "./salidas.types";

export interface SalidasSectionFiltersProps {
  filters: SalidasFilters;
  onApply: (filters: SalidasFilters) => void;
  onClear: () => void;
}