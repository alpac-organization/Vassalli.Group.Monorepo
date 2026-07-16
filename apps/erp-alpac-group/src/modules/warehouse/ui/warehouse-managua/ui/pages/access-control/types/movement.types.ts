export type MovementStatus = "PENDIENTE" | "COMPLETADO";

export type MovementQueueItem = {
  id: string;
  serviceOrder: string;
  ducaNumero: string;
  placaCabezal: string;
  driver: string;
  consignee: string;
  entry: string;
  status: MovementStatus;
};

export type AccessControlFilters = {
  ducaNumero: string;
  placaCabezal: string;
  conductor: string;
};

export type AccessControlMetrics = {
  totalIngresos: number;
  totalesEnPlanta: number;
  totalDespachados: number;
};
