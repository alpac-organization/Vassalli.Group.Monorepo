export interface WarehouseItemResponse {
  id: string;
  osNumber: string;
  placaCabezal: string;
  placaRastra?: string;
  conductor: string;
  duca: string;
  estado: 'EN_COLA' | 'ADUANA' | 'DESCARGANDO' | 'COMPLETADO';
  tiempoRestanteMinutos: number;
  tipoRegimen: 'FISCAL_A' | 'GENERAL_B' | 'PATIO';
  bultosDeclarados: number;
  pesoKg: number;
  observacionesMarchamo?: string;
  fechaIngreso: string;
}