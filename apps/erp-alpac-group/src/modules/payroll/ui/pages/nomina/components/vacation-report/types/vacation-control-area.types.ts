import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";

export type VacationControlAreaRow = {
  rowId: string;
  work_area: string;
  collaborator_code: string;
  collaborator_fullname: string;
  beginning_balance: number | null;
  final_balance: number | null;
  show_balances: boolean;
  permission: PermissionResponse | null;
};

export type VacationControlAreaPdfProps = {
  rows: VacationControlAreaRow[];
  branchName: string;
  startDate?: string;
  endDate?: string;
};

export type VacationControlAreaTotals = {
  beginning_balance: string;
  final_balance: string;
  days: string;
};
