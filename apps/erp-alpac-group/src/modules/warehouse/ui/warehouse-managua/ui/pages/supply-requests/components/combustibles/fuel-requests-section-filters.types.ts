import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";

export interface BranchOption {
  value: string;
  label: string;
}

export interface FuelRequestsFilters {
  code?: string;
  machinery_id?: string;
  status?: OutflowStatus;

  page_number?: number;
  page_size?: number;
}

export interface FuelRequestsSectionFiltersProps {
  filters: FuelRequestsFilters;
  machineryOptions?: BranchOption[];
  isMachineryLoading?: boolean;
  onApply: (filters: FuelRequestsFilters) => void;
  onClear: () => void;
}
