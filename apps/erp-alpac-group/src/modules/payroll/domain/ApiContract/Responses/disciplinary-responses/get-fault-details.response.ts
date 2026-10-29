import type { DisciplinaryEvidenceResponse } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/disciplinary-evidence.response";
import type { DisciplinaryUserResponse } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/disciplinary-user.response";
import type { FaultCatalogRefDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";
import type { FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import type { FaultSourceEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import type { FaultStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";

/**
 * Resumen de la falta padre cuando la falta actual fue absorbida por reincidencia.
 *
 * Convención: los orígenes apuntan a la falta escalada (`parent_fault_id`).
 * Se sanciona la padre, no cada origen por separado.
 *
 * @property {string} fault_id - Identificador de la falta escalada (padre).
 * @property {string} occurrence_date - Fecha de ocurrencia de la falta padre (`YYYY-MM-DD`).
 * @property {FaultSeverityEnumMap} severity - Severidad de la falta padre.
 * @property {FaultStatusEnumMap} status - Estado de la falta padre.
 */
export interface ParentFaultDto {
  fault_id: string;
  occurrence_date: string;
  severity: FaultSeverityEnumMap;
  status: FaultStatusEnumMap;
}

/**
 * Detalle completo de una falta disciplinaria.
 *
 * Endpoint: `GET .../faults/{fault_id}`
 *
 * Los enums llegan como clave de {@link FaultSeverityEnumMap} / {@link FaultSourceEnumMap} / {@link FaultStatusEnumMap}.
 * Las evidencias exponen `image_url` (no base64).
 *
 * @property {string} fault_id - Identificador de la falta.
 * @property {string} collaborator_id - Identificador del colaborador.
 * @property {string} collaborator_name - Nombre completo del colaborador.
 * @property {string|null} identification_number - Cédula / identificación (si está disponible).
 * @property {FaultCatalogRefDto} fault_catalog - Catálogo de la falta.
 * @property {string} occurrence_date - Fecha de ocurrencia (`YYYY-MM-DD`).
 * @property {FaultSeverityEnumMap} severity - Severidad: `Minor` | `Serious` | `VerySerious`.
 * @property {FaultSourceEnumMap} source - Origen: `Manual` | `SystemEscalation` | `BiometricClock`.
 * @property {FaultStatusEnumMap} status - Estado: `Open` | `SanctionApplied` | `Prescribed`.
 * @property {DisciplinaryEvidenceResponse[]} evidences - Evidencias con URL S3 (puede ser `[]`).
 * @property {ParentFaultDto|null} parent_fault - Falta padre por reincidencia; `null` si no aplica.
 * @property {DisciplinaryUserResponse|null} registered_by - Usuario que registró la falta.
 * @property {string} created_at - Fecha/hora de creación (ISO 8601 / UTC).
 *
 * @example
 * ```ts
 * const detail: FaultDetailDto = {
 *   fault_id: "...",
 *   collaborator_id: "...",
 *   collaborator_name: "Juan Perez",
 *   identification_number: "001-120390-0001A",
 *   fault_catalog: { fault_catalog_id: "...", code: "FL-ALP-01", name: "Llegada tarde" },
 *   occurrence_date: "2026-10-15",
 *   severity: "Minor",
 *   source: "Manual",
 *   status: "Open",
 *   evidences: [],
 *   parent_fault: null,
 *   registered_by: { user_id: "...", full_name: "Maria Lopez", email: "...", status: "Active" },
 *   created_at: "2026-10-15T18:30:00Z",
 * };
 * ```
 */
export interface FaultDetailDto {
  fault_id: string;
  collaborator_id: string;
  collaborator_name: string;
  identification_number: string | null;
  fault_catalog: FaultCatalogRefDto;
  occurrence_date: string;
  severity: FaultSeverityEnumMap;
  source: FaultSourceEnumMap;
  status: FaultStatusEnumMap;
  evidences: DisciplinaryEvidenceResponse[];
  parent_fault: ParentFaultDto | null;
  registered_by: DisciplinaryUserResponse | null;
  created_at: string;
}
