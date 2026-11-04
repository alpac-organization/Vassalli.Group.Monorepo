import type { OperationalRequestsFilters } from "./operational-requests.types";

export interface BranchOption {
  value: string;
  label: string;
}

export interface OperationalRequestsSectionFiltersProps {
  filters: OperationalRequestsFilters;
  branchOptions?: BranchOption[];
  isBranchesLoading?: boolean;
  onApply: (filters: OperationalRequestsFilters) => void;
  onClear: () => void;
}
