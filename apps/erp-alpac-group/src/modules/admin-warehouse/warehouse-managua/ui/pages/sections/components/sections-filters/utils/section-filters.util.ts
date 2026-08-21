import { SectionTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import type { Option } from "@alpac/design-system";
import { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/types/sections-filters.types";
export const SECTION_TYPE_FILTER_OPTIONS: Option[] = [
  ...Object.values(SectionTypeEnum).map((option) => ({
    value: String(option.value),
    label: option.label,
  })),
];

export const STORAGE_TYPE_FILTER_OPTIONS: Option[] = [
  ...Object.values(SectionStorageTypeEnum).map((option) => ({
    value: String(option.value),
    label: option.label,
  })),
];

export const STATUS_FILTER_OPTIONS: Option[] = [
  { value: "Activa", label: "Activa" },
  { value: "Inactiva", label: "Inactiva" },
];

export function buildFiltersPayload(values: SectionFilters): SectionFilters {
  return {
    searchTerm: values.searchTerm.trim(),
    filterType: values.filterType,
    filterStorage: values.filterStorage,
    filterStatus: values.filterStatus,
  };
}
