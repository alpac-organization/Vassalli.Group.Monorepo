export interface GetVacationsListResponse {
  data: VacationControlItemResponse[];
  total: number;
  page_size: number;
  page_number: number;
}

export interface VacationControlItemResponse {
  /**
   * Id del permiso de las vacaciones
   */
  permit_application_id: string | null;
  /**
   * Cantidad de dias de las vacaciones
   */
  amount_days: number;
  /**
   * Descripcion de las vacaciones
   */
  description: string | null;
  /**
   * Posicion de trabajo del colaborador
   */
  work_position: string | null;
  /**
   * Codigo del colaborador
   */
  collaborator_code: string | null;
  /**
   * Nombre completo del colaborador
   */
  collaborator_fullname: string | null;
  /**
   * Tipo de permiso de las vacaciones
   */
  approved_by: string | null;
  /**
   * Fecha de creación de la solicitud
   */
  created_at?: string;
  /**
   * Fecha de inicio de las vacaciones
   */
  start_date: string | null;
  /**
   * Fecha de fin de las vacaciones
   */
  end_date: string | null;
  /**
   * Hora de inicio de las vacaciones
   */
  start_time: string | null;
  /**
   * Hora de fin de las vacaciones
   */
  end_time: string | null;
  /**
   * Tipo de permiso de las vacaciones
   */
  /**
   * Id del colaborador que recibe las vacaciones donadas
   */
  identification_collaborator_to_receive: string | null;
  /**
   * Tipo de permiso de las vacaciones
   */
  permit_application_type: VacationControlPermitType;
}

export type VacationControlPermitType = "Vacation" | "DonatedVacations";
