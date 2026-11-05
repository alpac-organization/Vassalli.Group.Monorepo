import type { AbsenceDetailDto } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absence-details.response";
import type { AbsenceDto } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absences.response";

export type AbsenceDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: AbsenceDto | null;
  detail?: AbsenceDetailDto;
  isDetailLoading?: boolean;
  canWrite?: boolean;
  onApply?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
};
