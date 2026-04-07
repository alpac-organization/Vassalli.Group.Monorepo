import type { PermissionRequestStatus } from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";
import type { PermissionType } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
export interface PermissionHistoryResponse {
  /**
   * Identificador único de la solicitud de vacaciones
   */
  permit_application_id: string;
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
  start_time: string;
  /**
   * Hora de fin de la solicitud de vacaciones
   */
  end_time: string;
  /**
   * Estado de la solicitud de vacaciones
   */
  status: PermissionRequestStatus;
  /**
   * Tipo de permiso
   */
  type: PermissionType;
}
