import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Request para anular una falta disciplinaria (`DeletedAt` + estado `Cancelled` + motivo).
 *
 * Endpoint: `DELETE /companies/{company_id}/modules/{module_code}/faults/{fault_id}`
 *
 * Body JSON con `cancellation_reason` obligatorio (máx. 500 caracteres).
 * Respuesta esperada: `204 No Content`.
 *
 * Reglas:
 * - Solo falta padre o independiente (no hijas absorbidas).
 * - Bloqueado si estado `SanctionApplied` o `Prescribed`.
 * - Bloqueado si hay sanción `Pending` o `Applied`.
 * - Si es padre de reincidencia, anula también las hijas (mismo motivo).
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} fault_id - Identificador de la falta a anular (padre o independiente).
 * @property {string} cancellation_reason - Motivo de anulación (máx. 500 caracteres).
 *
 * @example
 * ```ts
 * const payload: CancelFaultRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   fault_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
 *   cancellation_reason: "Error de captura: la falta corresponde a otro colaborador.",
 * };
 * ```
 */
export interface CancelFaultRequest extends BaseRequest {
  fault_id: string;
  cancellation_reason: string;
}
