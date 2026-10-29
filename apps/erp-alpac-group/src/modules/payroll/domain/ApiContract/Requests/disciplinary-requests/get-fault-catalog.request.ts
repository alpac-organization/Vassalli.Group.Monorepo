import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";

/**
 * Request para listar el catálogo de faltas disciplinarias de la empresa.
 *
 * Endpoint: `GET /companies/{company_id}/modules/{module_code}/fault-catalogs`
 *
 * Si `page_size` no se envía, el backend puede devolver el total sin paginar.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {FaultSeverityEnumMap|number} [severity] - Filtro por severidad (`Minor` | `Serious` | `VerySerious` o valor numérico del enum).
 * @property {string} [code] - Filtro por código de catálogo (ej. `FL-ALP-01`).
 * @property {number} [page_number] - Número de página (default backend: `1`).
 * @property {number} [page_size] - Tamaño de página. Si no se envía, el API puede usar el total.
 *
 * @example
 * ```ts
 * const payload: GetFaultCatalogRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   severity: "Minor",
 *   code: "FL-ALP",
 *   page_number: 1,
 * };
 * ```
 */
export interface GetFaultCatalogRequest extends BaseRequest {
  severity?: FaultSeverityEnumMap | number;
  code?: string;
  page_number?: number;
  page_size?: number;
}
