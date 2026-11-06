import type { AbsenceDto } from "./get-absences.response";

export interface AbsenceDetailDto extends AbsenceDto {
  collaborator_code: string;
  reason?: string | null;
  registered_by: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  cancellation_reason?: string | null;
  salary_deduction: number;
  seventh_day_deduction: number;
  travel_expenses_deduction: number;
  total_deduction: number;
  payroll_id?: string | null;
  ordinary_payroll_id?: string | null;
  disciplinary_fault_id?: string | null;
  created_at: string;
  deleted_at?: string | null;
}
