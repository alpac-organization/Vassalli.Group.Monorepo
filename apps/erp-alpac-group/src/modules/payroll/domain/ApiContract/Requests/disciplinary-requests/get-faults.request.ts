import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import type { FaultSourceEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import type { FaultStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";

/**
 * Request para listar faltas disciplinarias con paginación y filtros.
 *
 * Endpoint: `GET /companies/{company_id}/modules/{module_code}/faults`
 *
 * Defaults del backend: `page_number = 1`, `page_size = 10`.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} [code] - Filtro por código del catálogo de falta (ej. `FL-ALP-01`).
 * @property {string} [collaborator_id] - Filtro por colaborador (GUID).
 * @property {FaultSeverityEnumMap|number} [severity] - Severidad: `Minor` | `Serious` | `VerySerious` (o valor numérico del enum).
 * @property {FaultStatusEnumMap|number} [status] - Estado: `Open` | `SanctionApplied` | `Prescribed` (o valor numérico del enum).
 * @property {FaultSourceEnumMap|number} [source] - Origen: `Manual` | `SystemEscalation` | `BiometricClock` (o valor numérico del enum).
 * @property {number} [page_number] - Número de página (default: `1`).
 * @property {number} [page_size] - Cantidad de registros por página (default: `10`).
 *
 * @example
 * ```ts
 * const payload: GetFaultsRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   status: "Open",
 *   severity: "Minor",
 *   page_number: 1,
 *   page_size: 10,
 * };
 * ```
 */
export interface GetFaultsRequest extends BaseRequest {
  code?: string;
  collaborator_id?: string;
  severity?: FaultSeverityEnumMap | number;
  status?: FaultStatusEnumMap | number;
  source?: FaultSourceEnumMap | number;
  page_number?: number;
  page_size?: number;
}
