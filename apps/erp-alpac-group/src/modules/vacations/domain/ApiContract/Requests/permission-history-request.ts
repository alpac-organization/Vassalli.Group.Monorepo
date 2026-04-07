export type PermissionRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

import type { PermissionType } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";

export type PermissionHistoryRequest = {
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
   * Estado de la solicitud de permisos. Omitir para retornar todos.
   */
  status?: PermissionRequestStatus;
  /**
   * Tipo de permiso. Omitir para retornar todos.
   */
  type?: PermissionType;
};

/** Valor del filtro de estado en UI: "all" = todos */
export type VacationStatusFilterValue = "all" | PermissionRequestStatus;
/** Valor del filtro de tipo de permiso en UI: "all" = todos */
export type PermissionTypeFilterValue = "all" | PermissionType;

/** Fila de la tabla de solicitudes de vacaciones (vista UI) */
export type PermissionHistoryRow = {
  id: string;
  full_name: string;
  type: PermissionType;
  start_date: string;
  end_date: string;
  start_time?: string | null;
  end_time?: string | null;
  status: PermissionRequestStatus;
  approved_by?: string;
  rejected_by?: string;
};
