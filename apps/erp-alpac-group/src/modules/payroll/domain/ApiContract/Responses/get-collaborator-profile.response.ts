/**
 * @interface GetCollaboratorProfileDetailsResponse
 * @description Define la estructura de datos para la respuesta del perfil de detalles de colaboradores.
 */
export interface GetCollaboratorProfileDetailsResponse {
  /**
   * Id del colaborador
   * @example "123e4567-e89b-12d3-a456-426614174000"
   * @required
   */
  collaborator_id: string;

  /**
   * Nombre completo del colaborador
   * @example "Juan Perez"
   * @required
   */
  full_name: string;

  /**
   * Estado del colaborador
   * @example "Activo"
   * @required
   */
  status: string;

  /**
   * Posición de trabajo del colaborador
   * @example "Contador"
   * @required
   */
  work_position: string;
  /**
   * Imagen del colaborador
   * @required
   */
  profile_picture_url: string | null;
  personal_information: CollaboratorProfilePersonalInformation;
  working_information: CollaboratorProfileWorkingInformation;
  salary_information: CollaboratorProfileSalaryInformation;
}

export interface CollaboratorProfilePersonalInformation {
  gender: string;
  identification_number: string;
  address: string;
  personal_email: string;
  personal_phone_number: string;
  /** Variante que algunos entornos envían */
  departament?: string;
  /** Variante alineada a Postman / API actual */
  department?: string;
}
export interface CollaboratorProfileWorkingInformation {
  inss_number: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  work_area: string | null;
  work_position: string | null;
  branch_name: string | null;
}
export interface CollaboratorProfileSalaryInformation {
  salary: number | null;
  currency: string | null;
  salary_type: string | null;
}
