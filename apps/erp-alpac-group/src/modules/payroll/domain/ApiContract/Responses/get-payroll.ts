import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-process.request";
export interface GetPayrollResponse {
  payroll_id: string;
  start_date: string;
  end_date: string;
  type: PayrollType;
  payroll_details: PayrollDetailsResponse;
}
export interface PayrollDetailsResponse {
  items: PayrollItemResponse[];
  total_items: number;
  page_size: number;
  page_number: number;
}
export interface PayrollItemResponse {
  ordinary_payroll_id: string;
  ir: number;
  inss: number;
  gross_salary: number;
  deductions: number;
  total_to_pay: number;
  collaborator: CollaboratorResponse | null;
}
export interface CollaboratorResponse {
  full_name: string;
  collaborator_code: string;
  identification_number: string;
}
