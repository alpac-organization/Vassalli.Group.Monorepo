import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Request para aprobar (aplicar) o cancelar/rechazar una sanción en estado `Pending`.
 *
 * Endpoint: `POST /companies/{company_id}/modules/{module_code}/sanctions/{sanction_id}/process`
 *
 * - `is_approved = true` → aplica (`Applied`). Solo `Administrator`.
 * - `is_approved = false` → rechaza (`Cancelled`). Requiere `cancellation_reason`. `Administrator` o `Manager`.
 *
 * Una sanción `Applied` no se puede retractar. Respuesta esperada: `200 OK`.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} sanction_id - Identificador de la sanción (path param).
 * @property {boolean} is_approved - `true` aplica; `false` cancela/rechaza.
 * @property {string} [cancellation_reason] - Obligatorio si `is_approved` es `false`. Máx. 500 caracteres.
 *
 * @example
 * ```ts
 * // Aprobar
 * const approve: ProcessSanctionRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   sanction_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
 *   is_approved: true,
 * };
 *
 * // Rechazar
 * const reject: ProcessSanctionRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   sanction_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
 *   is_approved: false,
 *   cancellation_reason: "No procede la sanción propuesta",
 * };
 * ```
 */
export interface ProcessSanctionRequest extends BaseRequest {
  sanction_id: string;
  is_approved: boolean;
  cancellation_reason?: string;
}
