import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-sections-req";
import type { SectionFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/types/sections-filters.types";

export function filtersToGetSectionsParams(
  filters: SectionFilters,
): Pick<
  GetSectionsRequest,
  "section_code" | "section_type" | "section_storage_type" | "is_active"
> {
  const sectionType = filters.filterType
    ? Number(filters.filterType)
    : undefined;
  const sectionStorageType = filters.filterStorage
    ? Number(filters.filterStorage)
    : undefined;

  return {
    section_code: filters.searchTerm.trim() || undefined,
    section_type:
      sectionType != null && !Number.isNaN(sectionType)
        ? sectionType
        : undefined,
    section_storage_type:
      sectionStorageType != null && !Number.isNaN(sectionStorageType)
        ? sectionStorageType
        : undefined,
    is_active:
      filters.filterStatus === "Activa"
        ? true
        : filters.filterStatus === "Inactiva"
          ? false
          : undefined,
  };
}
