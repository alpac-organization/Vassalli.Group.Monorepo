import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { DisciplinaryEvidenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/disciplinary-evidence.request";
import type { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import { SanctionTypeEnum as SanctionTypeEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";

/**
 * Request para aplicar una sanción disciplinaria (estado `Applied`, definitiva).
 *
 * Endpoint: `POST /companies/{company_id}/modules/{module_code}/sanctions`
 *
 * Respuesta esperada: `201 Created` (sin body).
 *
 * Reglas importantes:
 * - Usar `fault_id = sanction_target_fault_id` del endpoint `suggested-sanction`.
 * - No sancionar una falta con `parent_fault_id` (usar la padre).
 * - Evidencias requeridas salvo `VerbalWarning`.
 * - Si `sanction_type = Suspension`, fechas obligatorias y rango **3–7 días** inclusive.
 *
 * @extends BaseRequest
 *
 * @property {string} company_id - Identificador de la empresa (heredado de {@link BaseRequest}).
 * @property {string} module_code - Código del módulo (heredado de {@link BaseRequest}).
 * @property {string} fault_id - Falta a sancionar (debe ser el target del suggested; no una hija absorbida).
 * @property {string|number} sanction_type - Tipo: `VerbalWarning` | `Memorandum` | `Suspension` | `CommitmentLetter` | `Termination`.
 * @property {string} reason - Motivo de la sanción (máximo 500 caracteres).
 * @property {string|null} [suspension_start_date] - Inicio de suspensión (`YYYY-MM-DD`). Obligatorio si el tipo es `Suspension`.
 * @property {string|null} [suspension_end_date] - Fin de suspensión (`YYYY-MM-DD`). Obligatorio si Suspension; rango 3–7 días inclusive.
 * @property {DisciplinaryEvidenceRequest[]} [evidences] - Evidencias. Obligatorias salvo amonestación verbal.
 *
 * @example
 * ```ts
 * const payload: RegisterSanctionRequest = {
 *   company_id: "...",
 *   module_code: "PAYROLL",
 *   fault_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
 *   sanction_type: "Memorandum",
 *   reason: "Segunda falta leve en el mes",
 *   evidences: [{ file_name: "acta.jpg", content_type: "image/jpeg", image_base64: "..." }],
 * };
 * ```
 */
export interface RegisterSanctionRequest extends BaseRequest {
  fault_id: string;
  sanction_type: keyof typeof SanctionTypeEnumMap | SanctionTypeEnum | number;
  reason: string;
  suspension_start_date?: string | null;
  suspension_end_date?: string | null;
  evidences?: DisciplinaryEvidenceRequest[];
}
