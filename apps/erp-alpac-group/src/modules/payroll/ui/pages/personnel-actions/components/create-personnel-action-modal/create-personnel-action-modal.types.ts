export interface CreatePersonnelActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

export interface StagedCollaboratorItem {
  collaborator_id: string;
  collaborator_code?: string;
  full_name: string;
  identification_number?: string;
  current_salary?: number;
  current_currency?: string | number;
  current_job_position?: string;
  current_cost_center?: string;
  proposed_salary?: number | null;
  proposed_currency?: number | null;
  proposed_job_position_id?: string | null;
  proposed_job_position_name?: string | null;
  proposed_cost_center_id?: string | null;
  proposed_cost_center_name?: string | null;
}
