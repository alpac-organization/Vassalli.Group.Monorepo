import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

/**
 * Request para obtener el detalle completo de una falta disciplinaria.
 *
 * Endpoint: `GET /companies/{company_id}/modules/{module_code}/faults/{fault_id}`
 *
 * Incluye evidencias (`image_url`), falta padre (si escaló) y quién la registró.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} fault_id - Identificador de la falta a consultar.
 *
 * @example
 * ```ts
 * const payload: GetFaultDetailsRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   fault_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
 * };
 * ```
 */
export interface GetFaultDetailsRequest extends BaseRequest {
  fault_id: string;
}
