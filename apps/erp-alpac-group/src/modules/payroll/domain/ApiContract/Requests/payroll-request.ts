import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-process.request";
export interface PayrollRequest {
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
  type: PayrollType;
  /**
   * Numero de la pagina
   */
  /**
   * Id de la sucursal
   */
  branch_id: string;
  /**
   * Numero de la pagina
   */
  page_number?: number;
  /**
   * Tamaño de la pagina
   */
  page_size?: number;
}
