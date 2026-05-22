export interface GetPayrollReportsAccumulatedResponse {
  payroll_id: string;
  collaborator_id: string;
  salary_earned: number;
  accumulated_ir: number;
  collaborator_code: string;
  collaborator_fullname: string;
}

export interface GetPayrollReportsVacationAccrualResponse {
  collaborator_code: string;
  collaborator_fullname: string;
  vacation_balance: number;
  equivales_quantity: number;
  equivales_quantity_in_dollars: number;
}

export interface GetPayrollReportsPayloadResponse {
  accumulated_history: GetPayrollReportsAccumulatedResponse[];
  vacation_accruals_history: GetPayrollReportsVacationAccrualResponse[];
}

/** @deprecated Use GetPayrollReportsAccumulatedResponse */
export type GetPayrollReportsResponse = GetPayrollReportsAccumulatedResponse;
