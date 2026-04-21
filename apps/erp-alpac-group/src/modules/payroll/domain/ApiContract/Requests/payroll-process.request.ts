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
  /**
   * Identificador de la sucursal
   */
  branch_id: number;
}
export type PayrollType =
  | "None"
  | "Ordinary"
  | "Provided"
  | "ProfessionalServices";
