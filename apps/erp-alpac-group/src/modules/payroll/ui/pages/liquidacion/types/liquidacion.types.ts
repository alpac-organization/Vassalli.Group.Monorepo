export type LiquidacionConceptType = "ingreso" | "deduccion";

export type LiquidacionConceptStatus = "Aplicado" | "Pendiente";

export interface LiquidacionConcept {
  id: string;
  concepto: string;
  tipo: LiquidacionConceptType;
  monto: number;
  estado: LiquidacionConceptStatus;
}

export type LiquidacionCalculationDetailKind = "concepto" | "deduccion";

export interface LiquidacionCalculationDetail {
  id: string;
  concepto: string;
  valor: number | null;
  parametro?: string;
  cantidad?: string;
  kind: LiquidacionCalculationDetailKind;
}

export type SalaryType = "Fijo" | "Variable";

export interface CollaboratorSummary {
  identification: string;
  fullName: string;
  area: string;
  costCenter: string;
  hireDate: string;
  baseSalary: number;
  salaryType: SalaryType;
  status: string;
}

export type LiquidacionType =
  | "renuncia"
  | "despido"
  | "fin-contrato"
  | "mutuo-acuerdo";
