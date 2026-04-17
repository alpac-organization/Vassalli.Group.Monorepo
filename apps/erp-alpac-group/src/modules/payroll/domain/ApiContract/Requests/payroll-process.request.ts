export interface PayrollProcessRequest {
  /**
   * Identificador único de la empresa
   */
  company_id: string;
  /**
   * Codigo del modulo de nomina
   */
  module_code: string;
  /**
   * Tipo de proceso de nomina
   */
  payroll_type: PayrollType;
}
export type PayrollType = "None" | "Ordinary" | "Provided";
