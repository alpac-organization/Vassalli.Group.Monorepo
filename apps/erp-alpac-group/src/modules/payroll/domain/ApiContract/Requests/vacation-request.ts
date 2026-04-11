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
  /**
   * Estado de la solicitud de vacaciones. Omitir para retornar todos.
   */
  status?: ControlVacationStatusFilterValues;
}

export type ControlVacationStatusFilterValues = "all" | ControlVacationStatus;
export type ControlVacationStatus = "Pending" | "Cancelled";
// export interface ControlVacationHistoryRow {
//   vacation_id: string;
//   full_name: string;
//   start_date: string;
//   end_date: string;
//   status: ControlVacationStatus;
// }
