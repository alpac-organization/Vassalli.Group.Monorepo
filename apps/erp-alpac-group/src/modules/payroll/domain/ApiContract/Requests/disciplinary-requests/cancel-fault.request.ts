import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Request para anular (soft-delete) una falta disciplinaria.
 *
 * Endpoint: `DELETE /companies/{company_id}/modules/{module_code}/faults/{fault_id}`
 *
 * Solo aplica si la falta está en estado `Open` (no sancionada ni prescrita).
 * Respuesta esperada: `204 No Content`.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} fault_id - Identificador de la falta a anular.
 *
 * @example
 * ```ts
 * const payload: CancelFaultRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   fault_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
 * };
 * ```
 */
export interface CancelFaultRequest extends BaseRequest {
  fault_id: string;
}
