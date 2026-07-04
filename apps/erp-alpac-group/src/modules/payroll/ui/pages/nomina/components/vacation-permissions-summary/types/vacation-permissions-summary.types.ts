export type VacationPermissionsSummaryRow = {
  item: number;
  collaboratorCode: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  days: number;
  type: string;
};

export type VacationPermissionsSummaryHeader = {
  date: string;
  concept: string;
  observation: string;
};

export type VacationPermissionsSummaryPdfProps = {
  header: VacationPermissionsSummaryHeader;
  rows: VacationPermissionsSummaryRow[];
  branchName?: string;
};

export type ExportVacationPermissionsSummaryExcelParams = {
  header: VacationPermissionsSummaryHeader;
  rows: VacationPermissionsSummaryRow[];
  branchName?: string;
  startDate?: string;
  endDate?: string;
};
