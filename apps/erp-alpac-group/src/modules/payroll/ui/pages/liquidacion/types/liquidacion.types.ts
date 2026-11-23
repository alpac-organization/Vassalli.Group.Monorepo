export type LiquidacionConceptType = "ingreso" | "deduccion";

export type LiquidacionConceptStatus = "Aplicado" | "Pendiente";

export interface LiquidacionConcept {
  id: string;
  concepto: string;
  tipo: LiquidacionConceptType;
  monto: number;
  estado: LiquidacionConceptStatus;
}

export interface CollaboratorSummary {
  identification: string;
  fullName: string;
  area: string;
  costCenter: string;
  hireDate: string;
  baseSalary: number;
  status: string;
}

export type LiquidacionType =
  | "renuncia"
  | "despido"
  | "fin-contrato"
  | "mutuo-acuerdo";
