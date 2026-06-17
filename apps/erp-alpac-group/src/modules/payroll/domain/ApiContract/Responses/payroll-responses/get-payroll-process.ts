export interface GetPayrollProcessResponse {
  /**
   * Identificador único del proceso de nomina
   */
  payroll_id?: string;
  /**
   * Indica si existe un proceso de nomina en progreso
   */
  exist_payroll_in_progress: boolean;
}
