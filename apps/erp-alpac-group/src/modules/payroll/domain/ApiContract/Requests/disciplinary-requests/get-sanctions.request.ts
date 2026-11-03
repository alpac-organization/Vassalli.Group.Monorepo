import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { SanctionStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import type { SanctionTypeEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";

/**
 * Request para listar sanciones disciplinarias con paginación y filtros.
 *
 * Endpoint: `GET /companies/{company_id}/modules/{module_code}/sanctions`
 *
 * Defaults del backend: `page_number = 1`, `page_size = 10`.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} [collaborator_id] - Filtro por colaborador (GUID).
 * @property {string} [fault_id] - Filtro por falta asociada (GUID).
 * @property {SanctionTypeEnumMap|number} [sanction_type] - Tipo: `VerbalWarning` | `Memorandum` | `Suspension` | `CommitmentLetter` | `Termination` (o valor numérico del enum).
 * @property {SanctionStatusEnumMap|number} [sanction_status] - Estado: `Applied` | `Cancelled` (o valor numérico del enum).
 * @property {number} [page_number] - Número de página (default: `1`).
 * @property {number} [page_size] - Cantidad de registros por página (default: `10`).
 *
 * @example
 * ```ts
 * const payload: GetSanctionsRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   sanction_type: "Suspension",
 *   sanction_status: "Applied",
 *   page_number: 1,
 *   page_size: 10,
 * };
 * ```
 */
export interface GetSanctionsRequest extends BaseRequest {
  collaborator_id?: string;
  fault_id?: string;
  sanction_type?: SanctionTypeEnumMap | number;
  sanction_status?: SanctionStatusEnumMap | number;
  page_number?: number;
  page_size?: number;
}
