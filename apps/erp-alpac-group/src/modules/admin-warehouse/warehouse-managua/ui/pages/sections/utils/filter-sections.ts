import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";
import type { SectionFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/types/sections.types";

export function normalizeSections(payload: unknown): SectionResponse[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: SectionResponse[] }).data;
  }

  return [];
}

export function filterSections(
  sections: SectionResponse[],
  filters: SectionFilters,
): SectionResponse[] {
  const list = Array.isArray(sections) ? sections : [];
  const search = filters.searchTerm.toLowerCase();

  return list.filter((item) => {
    const name = item.section_name?.toLowerCase() ?? "";
    const code = item.section_code?.toLowerCase() ?? "";

    const matchesSearch =
      search === "" || name.includes(search) || code.includes(search);

    const matchesType =
      filters.filterType === "" || item.section_type === filters.filterType;

    const matchesStorage =
      filters.filterStorage === "" ||
      item.storage_type === filters.filterStorage;

    let matchesStatus = true;
    if (filters.filterStatus === "Activa") {
      matchesStatus = item.is_active === true;
    } else if (filters.filterStatus === "Inactiva") {
      matchesStatus = item.is_active === false;
    }

    return matchesSearch && matchesType && matchesStorage && matchesStatus;
  });
}
