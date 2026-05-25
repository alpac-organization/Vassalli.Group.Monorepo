import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { PayrollColumnDef } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";
import { formatCurrency } from "@app/shared/utils/currency.utils";

export function groupByWorkArea(
  items: PayrollItemResponse[],
): Map<string, PayrollItemResponse[]> {
  const map = new Map<string, PayrollItemResponse[]>();
  for (const item of items) {
    const area = item.collaborator?.work_area?.trim() || "Sin Área";
    if (!map.has(area)) map.set(area, []);
    map.get(area)!.push(item);
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function calcAreaTotals(
  items: PayrollItemResponse[],
  activeColumns: PayrollColumnDef[],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const col of activeColumns) {
    if (col.getValue) {
      const sum = items.reduce((acc, item) => acc + col.getValue!(item), 0);
      if (
        !(
          col.key === "number_overtime" ||
          col.key === "late_arrivals_in_minutes"
        )
      ) {
        result[col.key] = formatCurrency(sum, "NIO") ?? "—";
      } else {
        switch (col.key) {
          case "number_overtime":
            result[col.key] = `${sum} hrs`;
            break;
          case "late_arrivals_in_minutes":
            result[col.key] = `${sum} min`;
            break;
        }
      }
    } else {
      result[col.key] = "";
    }
  }
  return result;
}
