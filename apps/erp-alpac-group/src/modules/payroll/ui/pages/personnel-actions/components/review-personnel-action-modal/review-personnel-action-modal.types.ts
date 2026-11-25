import type { PersonnelActionRequestDto } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-actions.response";

export interface ReviewPersonnelActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  request: PersonnelActionRequestDto | null;
}
