import type { GetPayrollReportsVacationAccrualResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type {
  VacationControlAreaRow,
  VacationControlAreaTotals,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/types/vacation-control-area.types";
import {
  buildVacationControlPages,
  formatBalanceValue,
  formatPermissionDaysForTable,
  formatPermissionEndTime,
  formatPermissionPeriod,
  formatPermissionStartTime,
  formatPermissionStatus,
  formatPermissionType,
  hasPermissionTimeRange,
} from "@app/modules/payroll/ui/pages/nomina/components/vacation-report/utils/vacation-control.utils";

const PLACEHOLDER_DASH = "—";

export type VacationControlAreaColumnDef = {
  key: string;
  label: string;
  render: (row: VacationControlAreaRow) => string;
};

export const VACATION_CONTROL_AREA_COLUMNS: VacationControlAreaColumnDef[] = [
  {
    key: "collaborator_code",
    label: "Código",
    render: (row) => row.collaborator_code || PLACEHOLDER_DASH,
  },
  {
    key: "collaborator_fullname",
    label: "Nombre completo",
    render: (row) => row.collaborator_fullname || PLACEHOLDER_DASH,
  },
  {
    key: "beginning_balance",
    label: "Saldo Inicial",
    render: (row) =>
      row.show_balances
        ? formatBalanceValue(row.beginning_balance)
        : PLACEHOLDER_DASH,
  },
  {
    key: "final_balance",
    label: "Saldo Final",
    render: (row) =>
      row.show_balances
        ? formatBalanceValue(row.final_balance)
        : PLACEHOLDER_DASH,
  },
  {
    key: "permission_type",
    label: "Tipo",
    render: (row) =>
      row.permission
        ? formatPermissionType(row.permission.type)
        : PLACEHOLDER_DASH,
  },
  {
    key: "permission_period",
    label: "Fecha de Permiso",
    render: (row) =>
      row.permission
        ? formatPermissionPeriod(
            row.permission.start_date,
            row.permission.end_date,
          )
        : PLACEHOLDER_DASH,
  },
  {
    key: "permission_start_time",
    label: "Hora inicio",
    render: (row) =>
      row.permission
        ? formatPermissionStartTime(row.permission)
        : PLACEHOLDER_DASH,
  },
  {
    key: "permission_end_time",
    label: "Hora fin",
    render: (row) =>
      row.permission
        ? formatPermissionEndTime(row.permission)
        : PLACEHOLDER_DASH,
  },
  {
    key: "permission_days",
    label: "Días",
    render: (row) =>
      row.permission
        ? formatPermissionDaysForTable(row.permission)
        : PLACEHOLDER_DASH,
  },
  {
    key: "permission_status",
    label: "Estado",
    render: (row) =>
      row.permission
        ? formatPermissionStatus(row.permission.status)
        : PLACEHOLDER_DASH,
  },
];

export function buildVacationControlAreaRows(
  payrollItems: PayrollItemResponse[],
  accrualData: GetPayrollReportsVacationAccrualResponse[],
  permissions: PermissionResponse[],
): VacationControlAreaRow[] {
  const pages = buildVacationControlPages(
    payrollItems,
    accrualData,
    permissions,
  );

  const workAreaByCode = new Map<string, string>();
  for (const item of payrollItems) {
    if (!item.collaborator) continue;
    const code = item.collaborator.collaborator_code?.trim() ?? "";
    if (!code) continue;
    workAreaByCode.set(
      code,
      item.collaborator.work_area?.trim() || "Sin Área",
    );
  }

  const rows: VacationControlAreaRow[] = [];

  for (const page of pages) {
    const work_area = workAreaByCode.get(page.collaborator_code) ?? "Sin Área";
    const vacations = page.permissions.filter(
      (permission) => permission.type === "Vacation",
    );

    if (vacations.length === 0) {
      rows.push({
        rowId: `${page.collaborator_code}-empty`,
        work_area,
        collaborator_code: page.collaborator_code,
        collaborator_fullname: page.collaborator_fullname,
        beginning_balance: page.beginning_balance,
        final_balance: page.final_balance,
        show_balances: true,
        permission: null,
      });
      continue;
    }

    vacations.forEach((permission, index) => {
      rows.push({
        rowId:
          permission.permit_apllication_id ??
          `${page.collaborator_code}-${index}`,
        work_area,
        collaborator_code: page.collaborator_code,
        collaborator_fullname: page.collaborator_fullname,
        beginning_balance: page.beginning_balance,
        final_balance: page.final_balance,
        show_balances: index === 0,
        permission,
      });
    });
  }

  return rows;
}

export function groupVacationControlAreaByWorkArea(
  rows: VacationControlAreaRow[],
): Map<string, VacationControlAreaRow[]> {
  const map = new Map<string, VacationControlAreaRow[]>();
  for (const row of rows) {
    const area = row.work_area;
    if (!map.has(area)) map.set(area, []);
    map.get(area)!.push(row);
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function countUniqueCollaboratorsInAreaRows(
  rows: VacationControlAreaRow[],
): number {
  return new Set(rows.map((row) => row.collaborator_code)).size;
}

function sumVacationDays(rows: VacationControlAreaRow[]): number {
  return rows.reduce((acc, row) => {
    if (!row.permission || hasPermissionTimeRange(row.permission)) return acc;
    return acc + (row.permission.amount_days ?? 0);
  }, 0);
}

export function calcVacationControlAreaTotals(
  rows: VacationControlAreaRow[],
): VacationControlAreaTotals {
  const seen = new Set<string>();
  let beginningSum = 0;
  let finalSum = 0;

  for (const row of rows) {
    if (seen.has(row.collaborator_code)) continue;
    seen.add(row.collaborator_code);
    if (row.beginning_balance != null) beginningSum += row.beginning_balance;
    if (row.final_balance != null) finalSum += row.final_balance;
  }

  const daysSum = sumVacationDays(rows);

  return {
    beginning_balance: formatBalanceValue(beginningSum),
    final_balance: formatBalanceValue(finalSum),
    days: String(daysSum),
  };
}

export function getVacationControlAreaTotalForColumn(
  totals: VacationControlAreaTotals,
  columnKey: string,
): string {
  if (columnKey === "beginning_balance") return totals.beginning_balance;
  if (columnKey === "final_balance") return totals.final_balance;
  if (columnKey === "permission_days") return totals.days;
  return "";
}
