import type { ReceptionEntranceStatsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import type { AccessControlMetrics } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";

export function getAccessControlMetrics(
  stats?: ReceptionEntranceStatsResponse | null,
  totalCount = 0,
): AccessControlMetrics {
  return {
    totalIngresos: stats?.total_entries ?? totalCount,
    totalesEnPlanta: stats?.total_on_site ?? 0,
    totalDespachados: stats?.total_exists ?? 0,
  };
}
