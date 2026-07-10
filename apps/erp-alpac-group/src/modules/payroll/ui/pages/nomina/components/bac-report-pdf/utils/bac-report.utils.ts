import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { BacReportRow } from "../types/bac-report.types";

export function mapPayrollItemsToBacRows(
  items: PayrollItemResponse[],
): BacReportRow[] {
  return items
    .filter((item) => Boolean(item.collaborator?.bank_account?.trim()))
    .map((item) => ({
      identification_number: item.collaborator?.identification_number ?? "—",
      full_name: item.collaborator?.full_name ?? "—",
      biweekly_salary: item.biweekly_salary ?? 0,
    }));
}

export function buildBacReportPeriodLabel(
  startDate?: string,
  endDate?: string,
): string | undefined {
  const start = startDate?.trim();
  const end = endDate?.trim();

  if (!start || !end) return undefined;

  return `Fecha de: ${formatDateToSpanishWords(start)} al ${formatDateToSpanishWords(end)}`;
}
