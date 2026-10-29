import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSeverityEnum as FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import type { FaultStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import { FaultStatusEnum as FaultStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import type { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { FaultSourceEnum as FaultSourceEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";

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
 * @property {string|number} [severity] - Severidad: `Minor` | `Serious` | `VerySerious` (o número/clave del enum).
 * @property {string|number} [status] - Estado: `Open` | `SanctionApplied` | `Prescribed` (o número/clave del enum).
 * @property {string|number} [source] - Origen: `Manual` | `SystemEscalation` | `BiometricClock` (o número/clave).
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
  severity?:
    | keyof typeof FaultSeverityEnumMap
    | FaultSeverityEnum
    | number
    | string;
  status?:
    | keyof typeof FaultStatusEnumMap
    | FaultStatusEnum
    | number
    | string;
  source?:
    | keyof typeof FaultSourceEnumMap
    | FaultSourceEnum
    | number
    | string;
  page_number?: number;
  page_size?: number;
}
