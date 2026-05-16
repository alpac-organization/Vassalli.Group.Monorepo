import type { PermissionRequestStatus } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-history-request";
import type { PermissionType } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
export interface PermissionHistoryResponse {
  /**
   * Identificador único de la solicitud de vacaciones
   */
  permit_apllication_id: string;
  /**
   * Identificador único del colaborador
   */
  collaborator_id: string;
  /**
   * Codigo del colaborador
   */
  collaborator_code: string;
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
  /**
   * Fecha de creacion de la solicitud de vacaciones
   */
  requested_by: string;
  /**
   * Nombre completo del manager que aprueba el primer paso.
   */
  manager_fullname: string | null;
  /**
   * Nombre completo del administrador que aprueba el segundo paso.
   */
  administrator_full_name: string | null;
  /**
   * Indicador de aprobación del primer paso.
   */
  firts_step_approved: boolean | null;
  /**
   * Indicador de aprobación del segundo paso.
   */
  second_step_approved: boolean | null;
  /**
   * Identificador único del usuario que aprobo la solicitud de vacaciones
   */
  approved_by: string;
  /**
   * Identificador único del usuario que rechazo la solicitud de vacaciones
   */
  rejected_by: string;
  /**
   * Fecha de creacion de la solicitud de vacaciones
   */
  created_at: string;
  /**
   * Hora de inicio de la solicitud de vacaciones
   */
  start_time?: string;
  /**
   * Hora de fin de la solicitud de vacaciones
   */
  end_time?: string;
  /**
   * Estado de la solicitud de vacaciones
   */
  status: PermissionRequestStatus;
  /**
   * Tipo de permiso
   */
  type: PermissionType;
  /**
   * Cantidad de dias solicitados
   */
  amount_days: number;
}
