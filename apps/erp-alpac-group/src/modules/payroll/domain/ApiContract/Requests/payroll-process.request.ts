export interface PayrollProcessRequest {
  /**
   * Identificador único de la empresa
   */
  companyId: string;
  /**
   * Codigo del modulo de nomina
   */
  moduleCode: string;
  /**
   * Tipo de proceso de nomina
   */
  payrol_type: PayrollType;
}
export type PayrollType = "None" | "Ordinary" | "Provided";
