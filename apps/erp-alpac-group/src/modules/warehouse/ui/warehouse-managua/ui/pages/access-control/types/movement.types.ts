export type AccessControlFilters = {
  document_number?: string;
  document_type: string;
  vehicle_plate_number: string;
  container_number: string;
};

export type AccessControlMetrics = {
  totalIngresos: number;
  totalesEnPlanta: number;
  totalDespachados: number;
  totalContainerEnSitio: number;
  totalContainerFuera: number;
};
