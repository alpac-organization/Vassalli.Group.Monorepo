export interface CreateVacationRequest {
  /**
   * Identificador único de la empresa
   */
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
   * Nombre completo del colaborador
   */
  full_name: string;
  /**
   * Cargo del colaborador
   */
  cargo: string;
  /**
   * Fecha de inicio de las vacaciones
   */
  start_date: string;
  /**
   * Fecha de fin de las vacaciones
   */
  end_date: string;
  /**
   * Descripcion de la solicitud de vacaciones
   */
  description: string;
}
