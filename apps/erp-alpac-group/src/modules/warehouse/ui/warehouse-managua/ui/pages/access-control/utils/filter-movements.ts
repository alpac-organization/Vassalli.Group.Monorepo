import type {
  AccessControlFilters,
  AccessControlMetrics,
  MovementQueueItem,
} from "../types/movement.types";

export function filterMovements(
  items: MovementQueueItem[],
  filters: AccessControlFilters,
): MovementQueueItem[] {
  const duca = filters.ducaNumero.trim().toLowerCase();
  const placa = filters.placaCabezal.trim().toLowerCase();
  const conductor = filters.conductor.trim().toLowerCase();

  return items.filter((item) => {
    const matchesDuca =
      !duca ||
      item.ducaNumero.toLowerCase().includes(duca) ||
      item.serviceOrder.toLowerCase().includes(duca);

    const matchesPlaca = !placa || item.placaCabezal.toLowerCase() === placa;

    const matchesConductor =
      !conductor || item.driver.toLowerCase() === conductor;

    return matchesDuca && matchesPlaca && matchesConductor;
  });
}

export function getAccessControlMetrics(
  items: MovementQueueItem[],
): AccessControlMetrics {
  const totalIngresos = items.length;
  const totalDespachados = items.filter(
    (item) => item.status === "COMPLETADO",
  ).length;
  const totalesEnPlanta = totalIngresos - totalDespachados;

  return {
    totalIngresos,
    totalesEnPlanta,
    totalDespachados,
  };
}
