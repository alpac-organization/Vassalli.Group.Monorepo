/**
 * Sanción sugerida según severidad y reincidencia en el mes.
 *
 * Endpoint: `GET .../faults/{fault_id}/suggested-sanction`
 *
 * Regla UI: al hacer `POST /sanctions`, enviar
 * `fault_id = sanction_target_fault_id`.
 * Si `is_covered_by_escalation` es `true`, no sancionar la falta hija.
 *
 * @property {string} fault_id - Falta consultada (la abierta en UI).
 * @property {string} sanction_target_fault_id - Falta a usar como `fault_id` al registrar la sanción (padre si hubo escalamiento).
 * @property {string|null} parent_fault_id - Id de la falta padre si hubo escalamiento; `null` si no.
 * @property {boolean} is_covered_by_escalation - `true` si la falta hija ya no debe sancionarse individualmente.
 * @property {number} count_occurrence_in_month - Cantidad de faltas de la misma severidad en el mes (sobre el target).
 * @property {string} severity - Severidad del **target** (texto enum).
 * @property {string} suggested_sanction_type - Tipo sugerido (texto `SanctionType`, ej. `VerbalWarning`).
 * @property {string[]} allowed_sanction_types - Tipos que la UI puede ofrecer en el select.
 *
 * @example
 * ```ts
 * const suggested: SuggestedSanctionDto = {
 *   fault_id: "aaa...",
 *   sanction_target_fault_id: "aaa...",
 *   parent_fault_id: null,
 *   is_covered_by_escalation: false,
 *   count_occurrence_in_month: 1,
 *   severity: "Minor",
 *   suggested_sanction_type: "VerbalWarning",
 *   allowed_sanction_types: ["VerbalWarning", "Memorandum"],
 * };
 * ```
 */
export interface SuggestedSanctionDto {
  fault_id: string;
  sanction_target_fault_id: string;
  parent_fault_id: string | null;
  is_covered_by_escalation: boolean;
  count_occurrence_in_month: number;
  severity: string;
  suggested_sanction_type: string;
  allowed_sanction_types: string[];
}
