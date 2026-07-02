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
export interface GetPayrollReportsInssInformationResponse {
  collaborator_code: string;
  collaborator_fullname: string;
  income: number;
  absences: number;
  inss_lab: number;
  inss_patronal: number;
  inatec: number;
  total: number;
}
export interface GetIrAndSalaryEarnedResponse {
  payroll_id: string;
  collaborator_id: string;
  collaborator_code: string;
  collaborator_fullname: string;
  ir_fortnightly: number;
  salary_earned_fortnightly: number;
  ir_monthly: number;
  salary_earned_monthly: number;
}

export interface GetPayrollReportsDepreciationResponse {
  collaborator_id: string;
  collaborator_code: string | null;
  collaborator_fullname: string | null;
  amount_in_local: number;
  amount_in_dollars: number;
  description: string | null;
}

export interface SubsidyHistoryDto {
  collaborator_code: string | null;
  collaborator_full_name: string | null;
  amount_days: number;
  reference_number: string | null;
  type_subsidy_name: string | null;
  start_date: string;
  end_date: string;
  percentage: number;
  company_assumed_amount: number;
  inss_reimbursement_amount: number;
}

export interface GetPayrollReportsPayloadResponse {
  accumulated_history: GetPayrollReportsAccumulatedResponse[];

  vacation_accruals_history: GetPayrollReportsVacationAccrualResponse[];

  payment_travel_expenses: GetPaymentTravelExpensesResponse[];

  inss_information: GetPayrollReportsInssInformationResponse[];

  ir_and_salary_earned?: GetIrAndSalaryEarnedResponse[];

  depreciations?: GetPayrollReportsDepreciationResponse[];

  subsidies_history?: SubsidyHistoryDto[];
}

/** @deprecated Use GetPayrollReportsAccumulatedResponse */

export type GetPayrollReportsResponse = GetPayrollReportsAccumulatedResponse;
