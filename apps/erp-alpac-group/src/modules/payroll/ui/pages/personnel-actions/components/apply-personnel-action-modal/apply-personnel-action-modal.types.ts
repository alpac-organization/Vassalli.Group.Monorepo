import type { PersonnelActionRequestDto } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-actions.response";

export interface ApplyPersonnelActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  request: PersonnelActionRequestDto | null;
}
