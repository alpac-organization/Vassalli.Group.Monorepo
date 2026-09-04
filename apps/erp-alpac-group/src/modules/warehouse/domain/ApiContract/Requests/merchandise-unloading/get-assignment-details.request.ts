import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Solicitud para consultar el detalle de una asignación de descarga.
 */
export interface GetAssignmentDetailsRequest extends BaseRequest {
   assignment_id: string;
}
