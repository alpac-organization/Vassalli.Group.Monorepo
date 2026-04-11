import type { ControlVacationHistoryRow } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
export function statusBadgeColor(
  status: ControlVacationHistoryRow["status"],
): string {
  switch (status) {
    case "Cancelled":
      return "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200";
    default:
      return "bg-slate-100 text-slate-800";
  }
}
