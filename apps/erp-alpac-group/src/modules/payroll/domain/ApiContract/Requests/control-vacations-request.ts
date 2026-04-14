export interface ControlVacationHistoryRequest {
  company_id: string;
  /**
   * Codigo del modulo de vacaciones
   */
  module_code: string;
  /**
   * Numero de identificacion del colaborador
   */
  identification_number: string;

  /**
   * Tamaño de la pagina
   */
  page_size: number;
  /**
   * Numero de la pagina
   */
  page_number: number;
}

