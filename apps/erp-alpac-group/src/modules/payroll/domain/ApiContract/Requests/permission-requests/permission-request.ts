import type { PermissionType } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission.types";

export type PermissionStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

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

  payroll_id?: string;
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
