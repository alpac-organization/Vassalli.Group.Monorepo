import type { SalaryType } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/utils/utils_permissions";
export interface CollaboratorProfilePersonalInformation {
  gender?: string;
  identification_type?: string | number | null;
  identification_number?: string;
  address?: string;
  personal_email?: string;
  personal_phone_number?: string;
  birthdate?: string;
  marital_status?: string;
  department?: string;
}

interface CollaboratorProfileWorkingInformation {
  inss_number?: string;
  bank_account_number?: string;
  bank_name?: string;
  work_area?: string;
  work_email?: string;
  work_phone_number?: string;
  work_position?: string;
  branch_name?: string;
  entry_date?: string;
}

interface CollaboratorProfileSalaryInformation {
  salary?: number;
  currency?: string;
  salary_type?: SalaryType;
}

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
   * Código del colaborador
   * @example "XXX-XXXX"
   * @required
   */
  collaborator_code?: string;

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

  cost_centers: CostCenterDto[];

  /**
   * Imagen del colaborador
   * @required
   */
  profile_picture_url?: string;
  personal_information: CollaboratorProfilePersonalInformation;
  working_information: CollaboratorProfileWorkingInformation;
  salary_information: CollaboratorProfileSalaryInformation;
}

export interface CostCenterDto {
  area_id: string;
  cost_center_id: string;
  descripcion: string | null;
  cost_center_name: string;
}
