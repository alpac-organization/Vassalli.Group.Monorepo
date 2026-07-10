export interface BacReportRow {
  identification_number: string;
  full_name: string;
  biweekly_salary: number;
}

export interface BacReportPdfProps {
  data: BacReportRow[];
  startDate?: string;
  endDate?: string;
  branchName: string;
}
