import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { GetPayrollReportsInssInformationResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type {
  ConsolidatedAreaReportData,
  ConsolidatedAreaRow,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/types/consolidated-area-report.types";
import {
  accumulateParsedItem,
  createEmptyConsolidatedRow,
  parseConsolidatedItem,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/utils/consolidated-area-item.utils";
import {
  aggregateInssByArea,
  applyInssTotalsToRows,
  buildCollaboratorAreaMap,
} from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/utils/merge-inss-by-area.utils";
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
  "purisima",
  "totalDeduction",
  "netPay",
  "inssPatronal",
  "inatec",
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
  inssInformation?: GetPayrollReportsInssInformationResponse[],
): ConsolidatedAreaReportData {
  const grouped = groupByWorkArea(items);
  const rows = [...grouped.entries()].map(([areaName, areaItems]) => {
    const row = createEmptyConsolidatedRow(areaName);
    for (const item of areaItems) {
      accumulateParsedItem(row, parseConsolidatedItem(item));
    }
    return row;
  });

  if (inssInformation?.length) {
    const areaByCode = buildCollaboratorAreaMap(items);
    const inssByArea = aggregateInssByArea(inssInformation, areaByCode);
    applyInssTotalsToRows(rows, inssByArea);
  }

  const grandTotal = createEmptyConsolidatedRow("Total");
  for (const row of rows) {
    sumRowsInto(grandTotal, row);
  }

  return { rows, grandTotal };
}
