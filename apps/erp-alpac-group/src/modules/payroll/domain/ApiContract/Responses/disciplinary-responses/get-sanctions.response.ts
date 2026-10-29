import type { SanctionStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import type { SanctionTypeEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";

/**
 * Fila de sanción disciplinaria en listados paginados.
 *
 * Los enums (`sanction_type`, `sanction_status`) llegan como **texto**.
 *
 * @property {string} sanction_id - Identificador de la sanción.
 * @property {string} fault_id - Falta a la que se aplicó.
 * @property {string} collaborator_id - Colaborador sancionado.
 * @property {string} collaborator_name - Nombre completo del colaborador.
 * @property {string} sanction_type - Tipo: `VerbalWarning` | `Memorandum` | `Suspension` | `CommitmentLetter` | `Termination`.
 * @property {string} sanction_status - Estado: `Applied` | `Cancelled`.
 * @property {string} reason - Motivo de la sanción.
 * @property {string|null} suspension_start_date - Inicio de suspensión (`YYYY-MM-DD`) si aplica.
 * @property {string|null} suspension_end_date - Fin de suspensión (`YYYY-MM-DD`) si aplica.
 * @property {string} created_at - Fecha/hora de registro (ISO 8601).
 *
 * @example
 * ```ts
 * const row: SanctionDto = {
 *   sanction_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
 *   fault_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
 *   collaborator_id: "ee702059-9d26-4464-9900-c95b616d55c9",
 *   collaborator_name: "Juan Perez Gomez",
 *   sanction_type: "Memorandum",
 *   sanction_status: "Applied",
 *   reason: "Segunda falta leve en el mes",
 *   suspension_start_date: null,
 *   suspension_end_date: null,
 *   created_at: "2026-10-16T14:00:00Z",
 * };
 * ```
 */
export interface SanctionDto {
  sanction_id: string;
  fault_id: string;
  collaborator_id: string;
  collaborator_name: string;
  sanction_type: SanctionTypeEnumMap;
  sanction_status: SanctionStatusEnumMap;
  reason: string;
  suspension_start_date: string | null;
  suspension_end_date: string | null;
  created_at: string;
}

/**
 * Respuesta paginada de sanciones disciplinarias.
 *
 * @property {SanctionDto[]} data - Lista de sanciones.
 * @property {number} page_number - Página actual.
 * @property {number} page_size - Tamaño de página.
 * @property {number} total - Total de registros filtrados.
 */
export interface GetSanctionsResponse {
  data: SanctionDto[];
  page_number: number;
  page_size: number;
  total: number;
}
