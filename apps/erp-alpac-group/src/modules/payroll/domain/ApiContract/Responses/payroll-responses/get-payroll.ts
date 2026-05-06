import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export interface GetPayrollResponse {
  payroll_id: string;
  start_date: string;
  end_date: string;
  type: PayrollType;
  branch_name?: string;
  payroll_details: PayrollDetailsResponse;
}
interface PayrollDetailsResponse {
  items: PayrollItemResponse[];
  total_items: number;
  page_size: number;
  page_number: number;
}
export interface PayrollItemResponse {
  ordinary_payroll_id: string;
  biweekly_salary: number;
  bonus?: number;
  overtime?: number;
  number_of_overtime?: number;
  gross_salary: number;
  ir: number;
  inss: number;
  total_legal_deductions: number;
  deductions_additional_data?: string;
  total_deducctions: number;
  travel_expenses?: number;
  total_travel_expenses?: number;
  food_travel_allowance?: number;
  lodging?: number;
  vacations?: number;
  total_to_pay: number;
  collaborator: CollaboratorResponse | null;
}
export interface CollaboratorResponse {
  full_name: string;
  inss_number: string;
  collaborator_code: string;
  work_area?: string;
  job_position?: string;
  identification_number: string;
  entry_date: string;
}
