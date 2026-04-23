export interface ControlVacationHistoryRequest {
  company_id: string;
  /**
   * Codigo del modulo de vacaciones
   */
  module_code: string;
  /**
   * Fecha de inicio de las vacaciones
   */
  start_date: string;
  /**
   * Fecha de fin de las vacaciones
   */
  end_date: string;
  /**
   * Tamaño de la pagina
   */
  page_size?: number;
  /**
   * Numero de la pagina
   */
  page_number?: number;
}
