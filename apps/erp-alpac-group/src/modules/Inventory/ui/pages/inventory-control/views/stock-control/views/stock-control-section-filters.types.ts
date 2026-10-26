import type { StockControlFilters } from "../stock-control.types";

export interface StockControlSectionFiltersProps {
    filters: StockControlFilters
    onApply: (filters: StockControlFilters) => void;
    onClear: () => void;
}