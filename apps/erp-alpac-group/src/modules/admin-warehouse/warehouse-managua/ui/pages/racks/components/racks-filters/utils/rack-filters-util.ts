import type { Option } from "@alpac/design-system";
import { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import { RackUsageProfileEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-usage-profile";
import type { RackFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/types/racks.types";

export const STATUS_FILTER_OPTIONS: Option[] = [
  ...Object.values(RackStatusEnum).map((option) => ({
    value: option.textValue,
    label: option.label,
  })),
];

export const USAGE_FILTER_OPTIONS: Option[] = [
  ...Object.values(RackUsageProfileEnum).map((option) => ({
    value: option.textValue,
    label: option.label,
  })),
];

export function buildFiltersPayload(values: RackFilters): RackFilters {
  return {
    level: values.level.trim(),
    status: values.status,
    usage: values.usage,
  };
}
