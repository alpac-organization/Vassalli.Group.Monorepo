import type { Control } from "react-hook-form";
import type { StockControlFilters } from "../../stock-control.types";

export interface StockControlSectionFiltersProps {
    filters: StockControlFilters
    onApply: (filters: StockControlFilters) => void;
    onClear: () => void;
    applyLabel?: string;
    forceEnableApply?: boolean;
}

export type FilterDropdownProps = {
   control: Control<StockControlFilters>
}