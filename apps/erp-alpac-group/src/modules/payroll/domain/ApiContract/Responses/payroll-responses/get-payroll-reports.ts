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
  final_balance: number;
  beginning_balance: number;
  entry_date: string;
}
export interface GetPaymentTravelExpensesResponse {
  payroll_id: string;
  collaborator_id: string;
  collaborator_code: string | null;
  collaborator_fullname: string;
  transport: number;
  feeding: number;
  lodging: number;
}
export interface GetPayrollReportsPayloadResponse {
  accumulated_history: GetPayrollReportsAccumulatedResponse[];

  vacation_accruals_history: GetPayrollReportsVacationAccrualResponse[];

  payment_travel_expenses: GetPaymentTravelExpensesResponse[];
}

/** @deprecated Use GetPayrollReportsAccumulatedResponse */

export type GetPayrollReportsResponse = GetPayrollReportsAccumulatedResponse;
