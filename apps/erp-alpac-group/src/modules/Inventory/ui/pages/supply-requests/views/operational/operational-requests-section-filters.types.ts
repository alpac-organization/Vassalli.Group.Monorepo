import type { OperationalRequestsFilters } from "./operational-requests.types";

export interface OperationalRequestsSectionFiltersProps {
  filters: OperationalRequestsFilters;
  onApply: (filters: OperationalRequestsFilters) => void;
  onClear: () => void;
}
