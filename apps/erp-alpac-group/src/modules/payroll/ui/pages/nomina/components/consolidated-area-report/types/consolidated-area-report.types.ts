import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { GetPayrollReportsInssInformationResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PdfSignatory } from "@app/modules/payroll/ui/pages/nomina/types/payroll.types";

export type ConsolidatedAreaRow = {
  areaName: string;
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
  seizuresQty: number;
  seizuresAmount: number;
  lateArrivalsQty: number;
  lateArrivalsAmount: number;
  purisima: number;
  totalDeduction: number;
  netPay: number;
  inssPatronal: number;
  inatec: number;
};

export type ConsolidatedAreaReportData = {
  rows: ConsolidatedAreaRow[];
  grandTotal: ConsolidatedAreaRow;
};

export type ExportConsolidatedAreaExcelParams = {
  data: PayrollItemResponse[];
  inssInformation?: GetPayrollReportsInssInformationResponse[];
  branchName?: string | null;
  companyName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  logoUrl?: string | null;
};

export type ConsolidatedAreaPdfProps = {
  data: PayrollItemResponse[];
  inssInformation?: GetPayrollReportsInssInformationResponse[];
  branchName: string;
  companyName?: string | null;
  startDate?: string;
  endDate?: string;
  preparedBy?: PdfSignatory;
  //   reviewedBy?: PdfSignatory;
  preparedSignatureImageSrc?: string;
  //   reviewedSignatureImageSrc?: string;
};
