import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
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
   * Numero de identificacion del colaborador
   */
  identification_number?: string;
  /**
   * Id del area de trabajo
   */
  area_id?: string;
  /**
   * Id de la posicion de trabajo
   */
  job_position_id?: number;
  /**
   * Numero de la pagina
   */
  page_number?: number;
  /**
   * Tamaño de la pagina
   */
  page_size?: number;
}

export type PayrollClosedDetailsRequest = Omit<PayrollRequest, "type"> & {
  payroll_id: string;
};
