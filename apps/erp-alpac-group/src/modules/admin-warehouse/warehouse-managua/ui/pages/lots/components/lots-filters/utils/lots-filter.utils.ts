import type { Option } from "@alpac/design-system";
import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import { type LotFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/types/lots.types";

export const STATUS_FILTER_OPTIONS: Option[] = [
  ...Object.values(RackStatusEnum).map((option) => ({
    value: String(option.value),
    label: option.label,
  })),
];

export function buildFiltersPayload(values: LotFilters): LotFilters {
  return {
    searchTerm: values.searchTerm.trim(),
    filterStatus: values.filterStatus,
  };
}
