import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-payroll";

export type PayrollTableProps = {
  rows: PayrollItemResponse[];
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
};
