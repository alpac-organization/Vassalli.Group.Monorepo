import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export interface GetPayrollResponse {
  payroll_id: string;
  start_date: string;
  end_date: string;
  type: PayrollType;
  branch_name?: string;
  payroll_details: PayrollDetailsResponse;
  source_type?: PayrollSourceType;
}
export interface PayrollDetailsResponse {
  items: PayrollItemResponse[];
  total_items: number;
  page_size: number;
  page_number: number;
}
export type PayrollSourceType = "ordinary" | "professional" | "mixed" | "empty";
type PayrollItemCommonFields = {
  biweekly_salary: number;
  bonus?: number;
  overtime?: number;
  number_overtime?: number;
  gross_salary: number;
  ir: number;
  inss: number;
  total_legal_deductions: number;
  deductions_additional_data?: string;
  commissions?: number;
  inatec?: number;
  inssPatronal?: number;
  aguinaldo?: number;
  total_deducctions: number;
  total_travel_expenses?: number;
  transport?: number;
  feeding?: number;
  total_income?: number;
  antique?: number;
  lodging?: number;
  vacations?: number;
  amount_days_vacation?: number;
  DAEM?: string;
  total_to_pay: number;
  collaborator: CollaboratorResponse | null;
};

export type PayrollItemResponse =
  | ({
      ordinary_payroll_id: string;
      professional_service_payroll_id?: never;
    } & PayrollItemCommonFields)
  | ({
      ordinary_payroll_id?: never;
      professional_service_payroll_id: string;
    } & PayrollItemCommonFields);
export interface CollaboratorResponse {
  full_name: string;
  inss_number: string;
  collaborator_code: string;
  bank_account?: string;
  work_area?: string;
  job_position?: string;
  identification_number: string;
  entry_date: string;
}
