import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { TramoFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/types/tramos.types";

export function filtersToGetLotsParams(
  filters: TramoFilters,
): Pick<GetLotsRequest, "code" | "status"> {
  const status = filters.filterStatus
    ? Number(filters.filterStatus)
    : undefined;

  return {
    code: filters.searchTerm.trim() || undefined,
    status:
      status != null && !Number.isNaN(status) ? status : undefined,
  };
}
