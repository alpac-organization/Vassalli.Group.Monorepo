import type { PermissionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
/**
 * @interface ApplicationRequest
 * @description Define la estructura para las solicitudes de filtro
 * este contrato asegura que los datos enviados al backend cumplan con los requisitos del servidor
 */
export interface ApplicationRequest extends PermissionRequest {}
