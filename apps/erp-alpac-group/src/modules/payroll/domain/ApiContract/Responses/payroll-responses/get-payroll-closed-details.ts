import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { CollaboratorResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";

export type RawClosedPayrollItem = {
  ordinary_payroll_id?: string;
  professional_service_payroll_id?: string;
  collaborator_information: CollaboratorResponse | null;
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
  inss_patronal?: number;
  aguinaldo?: number;
  total_deducctions: number;
  total_travel_expenses?: number;
  transport?: number;
  feeding?: number;
  total_income?: number;
  antique?: number;
  lodging?: number;
  vacations?: number;
  DAEM?: string;
  total_to_pay: number;
};

export interface GetPayrollClosedDetailsRawResponse {
  payroll_id: string;
  start_date: string;
  end_date: string;
  type: PayrollType;
  branch_name?: string;
  ordinary_payroll_data: RawClosedPayrollItem[];
  professional_services_payroll_data: RawClosedPayrollItem[];
  total_items: number;
  page_size: number;
  page_number: number;
}
