import type { DataAccessControl } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import type { AccessControlMetrics } from "../types/movement.types";

export function getAccessControlMetrics(
  items: DataAccessControl[],
  totalCount: number,
): AccessControlMetrics {
  const totalDespachados = items.filter(
    (item) => item.status.toUpperCase() === "COMPLETADO",
  ).length;
  const totalesEnPlanta = items.filter(
    (item) => item.status.toUpperCase() !== "COMPLETADO",
  ).length;

  return {
    totalIngresos: totalCount,
    totalesEnPlanta,
    totalDespachados,
  };
}
