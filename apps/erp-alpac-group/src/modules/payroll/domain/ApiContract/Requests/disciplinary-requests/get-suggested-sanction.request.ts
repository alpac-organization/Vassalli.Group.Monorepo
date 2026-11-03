import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Request para obtener la sanción sugerida de una falta.
 *
 * Endpoint:
 * `GET /companies/{company_id}/modules/{module_code}/faults/{fault_id}/suggested-sanction`
 *
 * Usar antes de `POST /sanctions`. Si la falta fue absorbida por reincidencia,
 * la respuesta indica `is_covered_by_escalation` y el `sanction_target_fault_id`
 * (falta padre) que debe enviarse al registrar la sanción.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} fault_id - Identificador de la falta consultada (puede ser hija o padre).
 *
 * @example
 * ```ts
 * const payload: GetSuggestedSanctionRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   fault_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
 * };
 * ```
 */
export interface GetSuggestedSanctionRequest extends BaseRequest {
  fault_id: string;
}
