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
