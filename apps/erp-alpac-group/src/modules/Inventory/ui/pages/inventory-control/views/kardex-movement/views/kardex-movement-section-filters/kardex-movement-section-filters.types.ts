import type { KardexMovementFilters } from "../../kardex-movements.types";

export interface KardexMovementSectionFiltersProps {
    filters: KardexMovementFilters
    onApply: (filters: KardexMovementFilters) => void;
    onClear: () => void;
}