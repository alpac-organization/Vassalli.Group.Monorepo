import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type {
  ConsolidatedAreaReportData,
  ConsolidatedAreaRow,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/types/consolidated-area-report.types";
import {
  accumulateParsedItem,
  createEmptyConsolidatedRow,
  parseConsolidatedItem,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/utils/consolidated-area-item.utils";
import { groupByWorkArea } from "@app/modules/payroll/ui/pages/nomina/utils/payroll-report-grouping.utils";

const NUMERIC_KEYS: (keyof ConsolidatedAreaRow)[] = [
  "ordinarySalary",
  "fixedTravel",
  "vacations",
  "overtimeQty",
  "overtimeAmount",
  "holidayQty",
  "holidayAmount",
  "otherIncome",
  "totalIncome",
  "inssLaboral",
  "irEmployee",
  "absences",
  "loans",
  "seizuresQty",
  "seizuresAmount",
  "lateArrivalsQty",
  "lateArrivalsAmount",
  "vacationDeduction",
  "purisima",
  "others",
  "totalDeduction",
  "netPay",
];

function sumRowsInto(target: ConsolidatedAreaRow, source: ConsolidatedAreaRow) {
  for (const key of NUMERIC_KEYS) {
    const current = target[key];
    const next = source[key];
    if (typeof current === "number" && typeof next === "number") {
      (target[key] as number) = current + next;
    }
  }
}

export function buildConsolidatedAreaRows(
  items: PayrollItemResponse[],
): ConsolidatedAreaReportData {
  const grouped = groupByWorkArea(items);
  const rows = [...grouped.entries()].map(([areaName, areaItems]) => {
    const row = createEmptyConsolidatedRow(areaName);
    for (const item of areaItems) {
      accumulateParsedItem(row, parseConsolidatedItem(item));
    }
    return row;
  });

  const grandTotal = createEmptyConsolidatedRow("Total");
  for (const row of rows) {
    sumRowsInto(grandTotal, row);
  }

  return { rows, grandTotal };
}
