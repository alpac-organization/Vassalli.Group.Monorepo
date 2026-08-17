import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { TramoFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/types/tramos.types";

export function filterTramos(
  lots: LotListItemResponse[],
  filters: TramoFilters,
): LotListItemResponse[] {
  const search = filters.searchTerm.toLowerCase();

  return lots.filter((item) => {
    const matchesSearch =
      search === "" || item.code.toLowerCase().includes(search);

    const matchesStatus =
      filters.filterStatus === "" || item.status === filters.filterStatus;

    return matchesSearch && matchesStatus;
  });
}
