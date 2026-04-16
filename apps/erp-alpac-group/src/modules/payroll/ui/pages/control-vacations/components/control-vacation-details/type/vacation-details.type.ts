import type { VacationControlItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";

export interface ControlVacationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: VacationControlItemResponse | null;
}