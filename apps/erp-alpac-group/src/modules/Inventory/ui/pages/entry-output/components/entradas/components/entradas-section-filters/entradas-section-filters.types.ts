import type { EntradasFilters } from "../../entradas.types";

export interface EntradasSectionFiltersProps {
  filters: EntradasFilters;
  onApply: (filters: EntradasFilters) => void;
  onClear: () => void;
}
