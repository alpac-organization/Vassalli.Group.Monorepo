import type { DisciplinaryEvidenceResponse } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/disciplinary-evidence.response";
import type { DisciplinaryUserResponse } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/disciplinary-user.response";
import type { FaultCatalogRefDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";
import type { FaultSeverityEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import type { SanctionStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import type { SanctionTypeEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";

/**
 * Detalle completo de una sanción disciplinaria.
 *
 * Endpoint: `GET .../sanctions/{sanction_id}`
 *
 * Extiende conceptualmente a {@link SanctionDto} con datos de la falta,
 * evidencias, emisor y vínculo a nómina (`payroll_id`) si hubo efectos.
 *
 * @property {string} sanction_id - Identificador de la sanción.
 * @property {string} fault_id - Falta sancionada.
 * @property {string} collaborator_id - Colaborador sancionado.
 * @property {string} collaborator_name - Nombre completo.
 * @property {string|null} identification_number - Cédula / identificación.
 * @property {FaultCatalogRefDto} fault_catalog - Catálogo de la falta asociada.
 * @property {string} occurrence_date - Fecha de la falta (`YYYY-MM-DD`).
 * @property {FaultSeverityEnumMap} fault_severity - Severidad de la falta: `Minor` | `Serious` | `VerySerious`.
 * @property {SanctionTypeEnumMap} sanction_type - Tipo: `VerbalWarning` | `Memorandum` | `Suspension` | `CommitmentLetter` | `Termination`.
 * @property {SanctionStatusEnumMap} sanction_status - Estado: `Applied` | `Cancelled`.
 * @property {string} reason - Motivo.
 * @property {string|null} suspension_start_date - Inicio de suspensión si aplica.
 * @property {string|null} suspension_end_date - Fin de suspensión si aplica.
 * @property {string|null} payroll_id - Nómina vinculada si hubo efectos; puede ser `null`.
 * @property {string} issued_by - Usuario que emitió la sanción (GUID).
 * @property {DisciplinaryUserResponse|null} issued_by_user - Detalle del emisor (si el API lo incluye).
 * @property {DisciplinaryEvidenceResponse[]} evidences - Evidencias con URL S3.
 * @property {string} created_at - Fecha/hora de creación (ISO 8601).
 *
 * @example
 * ```ts
 * const detail: SanctionDetailDto = {
 *   sanction_id: "...",
 *   fault_id: "...",
 *   collaborator_id: "...",
 *   collaborator_name: "Juan Perez",
 *   identification_number: "001-120390-0001A",
 *   fault_catalog: { fault_catalog_id: "...", code: "FL-ALP-01", name: "Llegada tarde" },
 *   occurrence_date: "2026-10-15",
 *   fault_severity: "Minor",
 *   sanction_type: "Memorandum",
 *   sanction_status: "Applied",
 *   reason: "Segunda falta leve en el mes",
 *   suspension_start_date: null,
 *   suspension_end_date: null,
 *   payroll_id: null,
 *   issued_by: "11111111-1111-1111-1111-111111111111",
 *   issued_by_user: {
 *     user_id: "...",
 *     full_name: "Maria Lopez",
 *     email: "maria.lopez@empresa.com",
 *     status: "Active",
 *   },
 *   evidences: [],
 *   created_at: "2026-10-16T14:00:00Z",
 * };
 * ```
 */
export interface SanctionDetailDto {
  sanction_id: string;
  fault_id: string;
  collaborator_id: string;
  collaborator_name: string;
  identification_number: string | null;
  fault_catalog: FaultCatalogRefDto;
  occurrence_date: string;
  fault_severity: FaultSeverityEnumMap;
  sanction_type: SanctionTypeEnumMap;
  sanction_status: SanctionStatusEnumMap;
  reason: string;
  suspension_start_date: string | null;
  suspension_end_date: string | null;
  payroll_id: string | null;
  issued_by: string;
  issued_by_user: DisciplinaryUserResponse | null;
  evidences: DisciplinaryEvidenceResponse[];
  created_at: string;
}
