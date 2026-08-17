import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { SectionFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/types/sections.types";

export function filterSections(
  sections: SectionResponse[],
  filters: SectionFilters,
): SectionResponse[] {
  const search = filters.searchTerm.toLowerCase();

  return sections.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.section_name.toLowerCase().includes(search) ||
      item.section_code.toLowerCase().includes(search);

    const matchesType =
      filters.filterType === "" || item.section_type === filters.filterType;

    const matchesStorage =
      filters.filterStorage === "" || item.storage_type === filters.filterStorage;

    let matchesStatus = true;
    if (filters.filterStatus === "Activa") {
      matchesStatus = item.is_active === true;
    } else if (filters.filterStatus === "Inactiva") {
      matchesStatus = item.is_active === false;
    }

    return matchesSearch && matchesType && matchesStorage && matchesStatus;
  });
}
