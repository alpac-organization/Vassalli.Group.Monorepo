export interface GetVacationSaldoResponse {
  /**
   * Nombre completo del colaborador
   */
  full_name: string;
  /**
   * Vacaciones disponibles
   */
  available_vacations: number;
  /**
   * Vacaciones generadas
   */
  genered_vacation: number;
  /**
   * Vacaciones disfrutadas
   */
  enjoyed_vacation: number;
}
