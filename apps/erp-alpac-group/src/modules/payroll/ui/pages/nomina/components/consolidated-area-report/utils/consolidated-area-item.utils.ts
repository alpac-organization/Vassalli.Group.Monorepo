import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { parseAdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/parse-additional-deductions";
import type { ConsolidatedAreaRow } from "@app/modules/payroll/ui/pages/nomina/components/consolidated-area-report/types/consolidated-area-report.types";

export const PLACEHOLDER_VALUE = "—";

export type ParsedConsolidatedItem = {
  ordinarySalary: number;
  fixedTravel: number;
  vacations: number;
  overtimeQty: number;
  overtimeAmount: number;
  holidayQty: number;
  holidayAmount: number;
  otherIncome: number;
  totalIncome: number;
  inssLaboral: number;
  irEmployee: number;
  absences: number;
  loans: number;
  hasSeizure: boolean;
  seizuresAmount: number;
  lateArrivalsQty: number;
  lateArrivalsAmount: number;
  purisima: number;
  //   others: number;
  totalDeduction: number;
  netPay: number;
};

export function parseConsolidatedItem(
  item: PayrollItemResponse,
): ParsedConsolidatedItem {
  const deductions = parseAdditionalDeductions(item.deductions_additional_data);
  const seizuresAmount =
    (deductions?.JudicialSeizures ?? 0) +
    (deductions?.ChildSupportGarnishment ?? 0);

  return {
    ordinarySalary: item.gross_salary ?? 0,
    fixedTravel: item.total_travel_expenses ?? 0,
    vacations: item.vacations ?? 0,
    overtimeQty: item.number_overtime ?? 0,
    overtimeAmount: item.overtime ?? 0,
    holidayQty: 0, //agg holiday queda pending por ahora.
    holidayAmount: 0,
    otherIncome: item.commissions ?? 0,
    totalIncome: item.total_income ?? 0,
    inssLaboral: item.inss ?? 0,
    irEmployee: item.ir ?? 0,
    absences: deductions?.Absences ?? 0,
    loans: deductions?.Loans ?? 0,
    hasSeizure: seizuresAmount > 0,
    seizuresAmount,
    lateArrivalsQty: deductions?.LateArrivalsInMinutes ?? 0,
    lateArrivalsAmount: deductions?.LateArrivals ?? 0,
    purisima: deductions?.Purisima ?? 0,
    //  others:
    //    (deductions?.OtherDeductions ?? 0) + (deductions?.UniformDeduction ?? 0),
    totalDeduction: item.total_deducctions ?? 0,
    netPay: item.total_to_pay ?? 0,
  };
}

export function createEmptyConsolidatedRow(
  areaName: string,
): ConsolidatedAreaRow {
  return {
    areaName,
    ordinarySalary: 0,
    fixedTravel: 0,
    vacations: 0,
    overtimeQty: 0,
    overtimeAmount: 0,
    holidayQty: 0,
    holidayAmount: 0,
    otherIncome: 0,
    totalIncome: 0,
    inssLaboral: 0,
    irEmployee: 0,
    absences: 0,
    loans: 0,
    seizuresQty: 0,
    seizuresAmount: 0,
    lateArrivalsQty: 0,
    lateArrivalsAmount: 0,
    purisima: 0,
    totalDeduction: 0,
    netPay: 0,
    inssPatronal: PLACEHOLDER_VALUE,
    inatec: PLACEHOLDER_VALUE,
  };
}

export function accumulateParsedItem(
  row: ConsolidatedAreaRow,
  parsed: ParsedConsolidatedItem,
): void {
  row.ordinarySalary += parsed.ordinarySalary;
  row.fixedTravel += parsed.fixedTravel;
  row.vacations += parsed.vacations;
  row.overtimeQty += parsed.overtimeQty;
  row.overtimeAmount += parsed.overtimeAmount;
  row.holidayQty += parsed.holidayQty;
  row.holidayAmount += parsed.holidayAmount;
  row.otherIncome += parsed.otherIncome;
  row.totalIncome += parsed.totalIncome;
  row.inssLaboral += parsed.inssLaboral;
  row.irEmployee += parsed.irEmployee;
  row.absences += parsed.absences;
  row.loans += parsed.loans;
  row.seizuresQty += parsed.hasSeizure ? 1 : 0;
  row.seizuresAmount += parsed.seizuresAmount;
  row.lateArrivalsQty += parsed.lateArrivalsQty;
  row.lateArrivalsAmount += parsed.lateArrivalsAmount;
  row.purisima += parsed.purisima;
  row.totalDeduction += parsed.totalDeduction;
  row.netPay += parsed.netPay;
}
