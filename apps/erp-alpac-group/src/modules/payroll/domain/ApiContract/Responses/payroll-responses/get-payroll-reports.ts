export interface GetPayrollReportsResponse {
  payroll_id: string;
  collaborator_id: string;
  start_date: string;
  end_date: string;
  salary_earned: number;
  accumulated_ir: number;
  collaborator_code: string;
  collaborator_fullname: string;
}

export interface GetPayrollReportsPayloadResponse {
  accumulated_history: GetPayrollReportsResponse[];
}
