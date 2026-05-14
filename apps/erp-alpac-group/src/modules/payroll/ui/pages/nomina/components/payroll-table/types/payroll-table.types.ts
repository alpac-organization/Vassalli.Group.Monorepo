import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { PayrollColumnDef } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";

export type PayrollTableProps = {
  rows: PayrollItemResponse[];
  columns: PayrollColumnDef[];
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  visibleKeys: string[];
  onVisibleKeysChange: (keys: string[]) => void;
  onPageChange: (page: number) => void;
  onRowClick?: (row: PayrollItemResponse) => void;
  isPending?: boolean;
};

export type AdditionalDeductions = {
  Loans?: number;
  Absences?: number;
  Purisima?: number;
  Sanction?: number;
  CashShortage?: number;
  LateArrivals?: number;
  SalaryAdvance?: number;
  OtherDeductions?: number;
  JudicialSeizures?: number;
  UniformDeduction?: number;
  ChristmasBonusAdvance?: number;
  DeductionForLossesBulk?: number;
  ChildSupportGarnishment?: number;
};
