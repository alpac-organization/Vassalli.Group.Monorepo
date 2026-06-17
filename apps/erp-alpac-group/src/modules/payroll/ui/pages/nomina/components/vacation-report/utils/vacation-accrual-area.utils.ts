import type { GetPayrollReportsVacationAccrualResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { VacationAccrualAreaRow } from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-accrual-area.types";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDate } from "@app/shared/utils/string.utils";

export const PLACEHOLDER_DASH = "—";

export function formatVacationBalanceNumber(value: number): string {
  return parseFloat(value.toFixed(2)).toString();
}

export function roundVacationBalanceSum(value: number): number {
  return parseFloat(value.toFixed(2));
}

export type VacationAccrualAreaColumnDef = {
  key: string;
  label: string;
  render: (row: VacationAccrualAreaRow) => string | number;
  getValue?: (row: VacationAccrualAreaRow) => number;
  formatTotal?: (sum: number) => string;
};

export function getMonthlySalary(item: PayrollItemResponse): number {
  return (item.biweekly_salary ?? 0) * 2;
}

export function getSalaryPlusAntique(item: PayrollItemResponse): number {
  return getMonthlySalary(item) + (item.antique ?? 0);
}

function getEntryDate(row: VacationAccrualAreaRow): string {
  const collaboratorDate = row.payrollItem.collaborator?.entry_date?.trim();
  if (collaboratorDate) return collaboratorDate;
  return row.accrual?.entry_date?.trim() ?? "";
}

export const VACATION_ACCRUAL_AREA_COLUMNS: VacationAccrualAreaColumnDef[] = [
  {
    key: "collaborator_code",
    label: "Código de colaborador",
    render: (row) =>
      row.payrollItem.collaborator?.collaborator_code?.trim() ||
      PLACEHOLDER_DASH,
  },
  {
    key: "full_name",
    label: "Nombre completo",
    render: (row) =>
      row.payrollItem.collaborator?.full_name?.trim() || PLACEHOLDER_DASH,
  },
  {
    key: "entry_date",
    label: "Fecha de ingreso",
    render: (row) => formatDate(getEntryDate(row)) || PLACEHOLDER_DASH,
  },
  {
    key: "monthly_salary",
    label: "Sueldo mensual",
    render: (row) =>
      formatCurrency(getMonthlySalary(row.payrollItem), "NIO") ??
      PLACEHOLDER_DASH,
    getValue: (row) => getMonthlySalary(row.payrollItem),
    formatTotal: (sum) => formatCurrency(sum, "NIO") ?? PLACEHOLDER_DASH,
  },
  {
    key: "antique",
    label: "Antigüedad",
    render: (row) =>
      formatCurrency(row.payrollItem.antique ?? 0, "NIO") ?? PLACEHOLDER_DASH,
    getValue: (row) => row.payrollItem.antique ?? 0,
    formatTotal: (sum) => formatCurrency(sum, "NIO") ?? PLACEHOLDER_DASH,
  },
  {
    key: "salary_plus_antique",
    label: "Salario + antigüedad",
    render: (row) =>
      formatCurrency(getSalaryPlusAntique(row.payrollItem), "NIO") ??
      PLACEHOLDER_DASH,
    getValue: (row) => getSalaryPlusAntique(row.payrollItem),
    formatTotal: (sum) => formatCurrency(sum, "NIO") ?? PLACEHOLDER_DASH,
  },
  {
    key: "vacation_balance",
    label: "Saldo vacaciones",
    render: (row) => {
      const balance = row.accrual?.vacation_balance;
      if (balance == null) return PLACEHOLDER_DASH;
      return balance;
    },
    getValue: (row) => row.accrual?.vacation_balance ?? 0,
    formatTotal: (sum) => formatVacationBalanceNumber(sum),
  },
  {
    key: "agui_days",
    label: "Días AGUI",
    render: () => PLACEHOLDER_DASH,
  },
  {
    key: "equivales_quantity",
    label: "Equivalente en córdobas",
    render: (row) => {
      const value = row.accrual?.equivales_quantity;
      if (value == null) return PLACEHOLDER_DASH;
      return formatCurrency(value, "NIO") ?? PLACEHOLDER_DASH;
    },
    getValue: (row) => row.accrual?.equivales_quantity ?? 0,
    formatTotal: (sum) => formatCurrency(sum, "NIO") ?? PLACEHOLDER_DASH,
  },
  {
    key: "equivales_quantity_in_dollars",
    label: "Equivalente en dólares",
    render: (row) => {
      const value = row.accrual?.equivales_quantity_in_dollars;
      if (value == null) return PLACEHOLDER_DASH;
      return formatCurrency(value, "USD") ?? PLACEHOLDER_DASH;
    },
    getValue: (row) => row.accrual?.equivales_quantity_in_dollars ?? 0,
    formatTotal: (sum) => formatCurrency(sum, "USD") ?? PLACEHOLDER_DASH,
  },
  {
    key: "agui",
    label: "AGUI",
    render: () => PLACEHOLDER_DASH,
  },
  {
    key: "indem_years",
    label: "AÑOS INDEM",
    render: () => PLACEHOLDER_DASH,
  },
  {
    key: "indem_value",
    label: "Valor INDEM",
    render: () => PLACEHOLDER_DASH,
  },
];

export function buildVacationAccrualAreaRows(
  payrollItems: PayrollItemResponse[],
  accrualData: GetPayrollReportsVacationAccrualResponse[],
): VacationAccrualAreaRow[] {
  const accrualByCode = new Map<
    string,
    GetPayrollReportsVacationAccrualResponse
  >();
  for (const item of accrualData) {
    const code = item.collaborator_code?.trim();
    if (code) accrualByCode.set(code, item);
  }

  return payrollItems
    .filter((item) => item.collaborator)
    .map((item) => {
      const code = item.collaborator!.collaborator_code?.trim() ?? "";
      return {
        payrollItem: item,
        accrual: code ? (accrualByCode.get(code) ?? null) : null,
        work_area: item.collaborator?.work_area?.trim() || "Sin Área",
      };
    });
}

export function groupVacationAccrualAreaByWorkArea(
  rows: VacationAccrualAreaRow[],
): Map<string, VacationAccrualAreaRow[]> {
  const map = new Map<string, VacationAccrualAreaRow[]>();
  for (const row of rows) {
    const area = row.work_area;
    if (!map.has(area)) map.set(area, []);
    map.get(area)!.push(row);
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function calcVacationAccrualAreaTotals(
  rows: VacationAccrualAreaRow[],
  columns: VacationAccrualAreaColumnDef[] = VACATION_ACCRUAL_AREA_COLUMNS,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const col of columns) {
    if (!col.getValue) {
      result[col.key] = "";
      continue;
    }
    const sum = rows.reduce((acc, row) => acc + col.getValue!(row), 0);
    const normalizedSum =
      col.key === "vacation_balance" ? roundVacationBalanceSum(sum) : sum;
    result[col.key] = col.formatTotal
      ? col.formatTotal(normalizedSum)
      : String(normalizedSum);
  }
  return result;
}

export function calcVacationAccrualAreaTotalsRaw(
  rows: VacationAccrualAreaRow[],
  columns: VacationAccrualAreaColumnDef[] = VACATION_ACCRUAL_AREA_COLUMNS,
): Record<string, number | string> {
  const result: Record<string, number | string> = {};
  for (const col of columns) {
    if (!col.getValue) {
      result[col.key] = "";
      continue;
    }
    const sum = rows.reduce((acc, row) => acc + col.getValue!(row), 0);
    result[col.key] =
      col.key === "vacation_balance" ? roundVacationBalanceSum(sum) : sum;
  }
  return result;
}
