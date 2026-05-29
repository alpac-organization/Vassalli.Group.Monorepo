import type { AdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/types/payroll-table.types";
export const DEDUCTION_META: Record<
  keyof AdditionalDeductions,
  { label: string; abbrev: string }
> = {
  Loans: { label: "Préstamos", abbrev: "PR" },
  Absences: { label: "Ausencias", abbrev: "AUS" },
  Purisima: { label: "Purísima", abbrev: "PUR" },
  Sanction: { label: "Sanción", abbrev: "SAN" },
  CashShortage: { label: "Faltante de Caja", abbrev: "FC" },
  LateArrivals: { label: "Llegadas Tardías", abbrev: "LT" },
  LateArrivalsInMinutes: { label: "Llegadas Tardías (min)", abbrev: "LTM" },
  SalaryAdvance: { label: "Adelanto de Salario", abbrev: "AS" },
  OtherDeductions: { label: "Otras Deducciones", abbrev: "OD" },
  JudicialSeizures: { label: "Embargo Judicial", abbrev: "EJ" },
  UniformDeduction: { label: "Deducción de Uniforme", abbrev: "DU" },
  ChristmasBonusAdvance: { label: "Aguinaldo Anticipado", abbrev: "AA" },
  DeductionForLossesBulk: { label: "Deducción por Pérdidas", abbrev: "DP" },
  ChildSupportGarnishment: { label: "Pensión Alimenticia", abbrev: "PA" },
};
