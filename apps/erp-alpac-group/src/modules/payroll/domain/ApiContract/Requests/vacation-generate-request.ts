export interface ControlVacationGenerateRequest {
  /**
   * Identificador único de la empresa
   */
  company_id: string;
  /**
   * Codigo del modulo de vacaciones
   */
  module_code: string;

  id_control_vacation: string;
}
