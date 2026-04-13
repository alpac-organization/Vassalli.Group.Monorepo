import type { GetVacationsHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-vacations-response";
export function statusBadgeColor(
  status: GetVacationsHistoryResponse["status"],
): string {
  switch (status) {
    case "Cancelled":
      return "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200";
    default:
      return "bg-slate-100 text-slate-800";
  }
}
