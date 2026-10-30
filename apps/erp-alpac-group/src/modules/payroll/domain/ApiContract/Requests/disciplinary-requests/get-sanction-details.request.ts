import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Request para obtener el detalle completo de una sanción disciplinaria.
 *
 * Endpoint:
 * `GET /companies/{company_id}/modules/{module_code}/sanctions/{sanction_id}`
 *
 * Incluye evidencias (`image_url`), emisor, catálogo de la falta y `payroll_id` si aplica.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} sanction_id - Identificador de la sanción a consultar.
 *
 * @example
 * ```ts
 * const payload: GetSanctionDetailsRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   sanction_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
 * };
 * ```
 */
export interface GetSanctionDetailsRequest extends BaseRequest {
  sanction_id: string;
}
