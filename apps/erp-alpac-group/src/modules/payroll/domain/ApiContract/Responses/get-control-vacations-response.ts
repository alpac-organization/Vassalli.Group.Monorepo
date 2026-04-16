export interface GetVacationsListResponse {
   data: VacationControlItemResponse[];
   total_records: number;
   page_size: number;
   page_number: number;
}

export interface VacationControlItemResponse {
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
  permit_application_type: VacationControlPermitType;
}

export type VacationControlPermitType = "Vacation" | "DonatedVacations";
