export type VacationRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export type VacationHistoryRequest = {
  /**
   * Codigo del modulo de vacaciones
   */
  module_code: string;
  /**
   * Identificador único de la empresa
   */
  companie_id: string;
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
  status?: VacationRequestStatus;
};

/** Valor del filtro de estado en UI: "all" = todos */
export type VacationStatusFilterValue = "all" | VacationRequestStatus;

/** Fila de la tabla de solicitudes de vacaciones (vista UI) */
export type VacationRequestRow = {
  id: string;
  full_name: string;
  start_date: string;
  end_date: string;
  status: VacationRequestStatus;
  approved_by?: string;
  rejected_by?: string;
};
