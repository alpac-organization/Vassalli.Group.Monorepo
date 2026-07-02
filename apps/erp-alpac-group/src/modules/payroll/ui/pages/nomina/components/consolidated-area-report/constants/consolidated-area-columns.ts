import type { ConsolidatedAreaRow } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/types/consolidated-area-report.types";
import { formatCurrency } from "@app/shared/utils/currency.utils";

export type ConsolidatedColumnKind = "text" | "currency" | "quantity";

export type ConsolidatedColumnDef = {
  key: keyof ConsolidatedAreaRow;
  label: string;
  group?: string;
  subLabel?: string;
  kind: ConsolidatedColumnKind;
  width?: number;
};

export const CONSOLIDATED_AREA_COLUMNS: ConsolidatedColumnDef[] = [
  { key: "areaName", label: "Area", kind: "text", width: 28 },
  {
    key: "ordinarySalary",
    label: "Salario Ordinario",
    kind: "currency",
    width: 14,
  },
  { key: "fixedTravel", label: "Viaticos Fijos", kind: "currency", width: 12 },
  { key: "vacations", label: "Vacaciones", kind: "currency", width: 12 },
  {
    key: "overtimeQty",
    label: "Horas Extras",
    subLabel: "Cant",
    kind: "quantity",
    width: 8,
  },
  {
    key: "overtimeAmount",
    label: "Horas Extras",
    subLabel: "Monto",
    kind: "currency",
    width: 12,
  },
  {
    key: "holidayQty",
    label: "Feriados",
    subLabel: "Cant",
    kind: "quantity",
    width: 8,
  },
  {
    key: "holidayAmount",
    label: "Feriados",
    subLabel: "Monto",
    kind: "currency",
    width: 12,
  },
  { key: "otherIncome", label: "Otros Ingresos", kind: "currency", width: 12 },
  { key: "totalIncome", label: "Total Ingresos", kind: "currency", width: 14 },
  { key: "inssLaboral", label: "INSS Laboral", kind: "currency", width: 12 },
  { key: "irEmployee", label: "IR Empleado", kind: "currency", width: 12 },
  { key: "absences", label: "Ausencia", kind: "currency", width: 10 },
  {
    key: "loans",
    label: "Prestamos",
    group: "Deducciones",
    kind: "currency",
    width: 12,
  },
  {
    key: "seizuresQty",
    label: "Embargos",
    group: "Deducciones",
    subLabel: "Cant",
    kind: "quantity",
    width: 8,
  },
  {
    key: "seizuresAmount",
    label: "Embargos",
    group: "Deducciones",
    subLabel: "Monto",
    kind: "currency",
    width: 12,
  },
  {
    key: "lateArrivalsQty",
    label: "Llegadas Tar",
    group: "Deducciones",
    subLabel: "Cant",
    kind: "quantity",
    width: 8,
  },
  {
    key: "lateArrivalsAmount",
    label: "Llegadas Tar",
    group: "Deducciones",
    subLabel: "Monto",
    kind: "currency",
    width: 12,
  },
  {
    key: "purisima",
    label: "Purisima",
    group: "Deducciones",
    kind: "currency",
    width: 10,
  },
  {
    key: "totalDeduction",
    label: "Total Deduccion",
    kind: "currency",
    width: 14,
  },
  { key: "netPay", label: "Neto a Recibir", kind: "currency", width: 14 },
  { key: "inssPatronal", label: "INSS Patronal", kind: "currency", width: 12 },
  { key: "inatec", label: "INATEC 2%", kind: "currency", width: 10 },
];

export function formatConsolidatedCellValue(
  row: ConsolidatedAreaRow,
  column: ConsolidatedColumnDef,
): string | number {
  const value = row[column.key];

  if (column.kind === "text") {
    return typeof value === "string" ? value : String(value ?? "—");
  }

  if (column.kind === "quantity") {
    return typeof value === "number" ? value : 0;
  }

  return formatCurrency(Number(value ?? 0), "NIO") ?? "—";
}

export function getConsolidatedColumnCount(): number {
  return CONSOLIDATED_AREA_COLUMNS.length;
}
