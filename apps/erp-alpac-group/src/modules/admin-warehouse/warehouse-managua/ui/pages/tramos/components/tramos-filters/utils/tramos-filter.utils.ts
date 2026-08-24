import type { Option } from "@alpac/design-system";
import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import { type TramoFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/types/tramos.types";

export const STATUS_FILTER_OPTIONS: Option[] = [
  ...Object.values(RackStatusEnum).map((option) => ({
    value: String(option.value),
    label: option.label,
  })),
];

export function buildFiltersPayload(values: TramoFilters): TramoFilters {
  return {
    searchTerm: values.searchTerm.trim(),
    filterStatus: values.filterStatus,
  };
}
