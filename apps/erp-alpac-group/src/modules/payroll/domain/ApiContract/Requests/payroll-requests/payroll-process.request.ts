export interface PayrollProcessRequest {
  /**
   * Identificador único de la empresa
   */
  companie_id: string;
  /**
   * Codigo del modulo de nomina
   */
  module_code: string;
  /**
   * Tipo de proceso de nomina
   */
  payrol_type: PayrollType;

  /**
   * Identificador de la sucursal
   */
  branch_id: string;
}
export type PayrollType =
  | "None"
  | "Ordinary"
  | "Provided"
  | "Prestacionado"
  | "ProfessionalServices";
