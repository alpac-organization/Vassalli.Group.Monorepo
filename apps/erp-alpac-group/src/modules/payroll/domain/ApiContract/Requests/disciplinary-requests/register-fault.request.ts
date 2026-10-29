import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { DisciplinaryEvidenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/disciplinary-evidence.request";
import type { FaultSourceEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";

/**
 * Ítem individual de falta a registrar dentro de {@link RegisterFaultRequest}.
 *
 * En registro manual desde UI, `source` suele ser `Manual` (valor `1`)
 * y `parent_fault_id` va en `null`.
 *
 * @property {string} collaborator_id - Colaborador al que se imputa la falta.
 * @property {string} fault_catalog_id - Tipo de falta del catálogo (`fault-catalogs`).
 * @property {string} occurrence_date - Fecha de ocurrencia (`YYYY-MM-DD`). No puede ser futura.
 * @property {FaultSourceEnumMap|number} source - Origen: `Manual` | `SystemEscalation` | `BiometricClock` (o valor numérico del enum).
 * @property {string|null} [parent_fault_id] - Falta padre si ya está vinculada a reincidencia. En registro manual normalmente `null`.
 * @property {DisciplinaryEvidenceRequest[]} [evidences] - Evidencias opcionales (imágenes en base64). Default recomendado: `[]`.
 *
 * @example
 * ```ts
 * const item: RegisterFaultItemRequest = {
 *   collaborator_id: "ee702059-9d26-4464-9900-c95b616d55c9",
 *   fault_catalog_id: "7708d447-1b6a-4194-a877-7e6f49cd80b4",
 *   occurrence_date: "2026-10-15",
 *   source: "Manual",
 *   parent_fault_id: null,
 *   evidences: [],
 * };
 * ```
 */
export interface RegisterFaultItemRequest {
  collaborator_id: string;
  fault_catalog_id: string;
  occurrence_date: string;
  source: FaultSourceEnumMap | number;
  parent_fault_id?: string | null;
  evidences?: DisciplinaryEvidenceRequest[];
}

/**
 * Request para registrar una o más faltas disciplinarias.
 *
 * Endpoint: `POST /companies/{company_id}/modules/{module_code}/faults`
 *
 * Respuesta esperada: `201 Created` (sin body).
 * Tras el registro el backend puede crear una falta por reincidencia
 * (`SystemEscalation`) y enlazar orígenes con `parent_fault_id`.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {RegisterFaultItemRequest[]} faults - Lista de faltas a registrar (al menos una).
 *
 * @example
 * ```ts
 * const payload: RegisterFaultRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   faults: [
 *     {
 *       collaborator_id: "...",
 *       fault_catalog_id: "...",
 *       occurrence_date: "2026-10-15",
 *       source: 1,
 *       evidences: [],
 *     },
 *   ],
 * };
 * ```
 */
export interface RegisterFaultRequest extends BaseRequest {
  faults: RegisterFaultItemRequest[];
}
