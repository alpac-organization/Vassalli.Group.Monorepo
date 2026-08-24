import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";
import type { TramoFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/types/tramos.types";

// Esta función toma los filtros aplicados en la UI y los mapea al contrato esperado por la request GetLotsRequest,
// permitiendo filtrar los tramos por código y por estado cuando estos valores estén presentes.
export function filtersToGetLotsParams(
  filters: TramoFilters,
): Pick<GetLotsRequest, "code" | "status"> {
  const status = filters.filterStatus
    ? Number(filters.filterStatus)
    : undefined;

  return {
    code: filters.searchTerm.trim() || undefined,
    status: status != null && !Number.isNaN(status) ? status : undefined,
  };
}
