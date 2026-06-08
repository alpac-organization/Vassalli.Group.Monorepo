export type PermissionStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

import type { PermissionType } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";

export type PermissionRequest = {
  module_code: string;
  /**
   * Identificador único de la empresa
   */
  companie_id: string;
  /**
   * Numero de identificacion del colaborador
   */
  identification_number?: string;
  /**
   * Tamaño de la pagina
   */
  page_size: number;
  /**
   * Numero de la pagina
   */
  page_number: number;
  /**
   * Estado de la solicitud de permisos. Omitir para retornar todos.
   */
  status?: PermissionStatus;
  /**
   * Tipo de permiso. Omitir para retornar todos.
   */
  type?: PermissionType;
};
/** Valor del filtro de estado en UI: "all" = todos */
export type VacationStatusFilterValue = "all" | PermissionStatus;
/** Valor del filtro de tipo de permiso en UI: "all" = todos */
export type PermissionTypeFilterValue = "all" | PermissionType;

/** Fila de la tabla de solicitudes de vacaciones (vista UI) */
// export type PermissionHistoryRow = {
//   id: string;
//   full_name: string;
//   type: PermissionType;
//   start_date: string;
//   end_date: string;
//   start_time?: string | null;
//   end_time?: string | null;
//   status: PermissionStatus;
//   approved_by?: string;
//   rejected_by?: string;
// };

export type PermissionHistoryRow = {
  id: string;
  collaborator_id: string;
  full_name: string;
  description?: string;
  first_step_status_reviewed_by?: string;
  second_step_status_reviewed_by?: string;
  type: PermissionType;
  amount_days?: number;
  start_date: string;
  end_date: string;
  start_time?: string | null;
  end_time?: string | null;
  status: PermissionStatus;
};
