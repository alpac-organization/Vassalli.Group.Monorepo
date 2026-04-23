import type { VacationControlItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

export interface ControlVacationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: VacationControlItemResponse | null;
}
