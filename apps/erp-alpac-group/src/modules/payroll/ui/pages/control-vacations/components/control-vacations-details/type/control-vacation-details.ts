import type { GetVacationsHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-vacations-response";
export type ControlVacationDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: GetVacationsHistoryResponse | null;
  collaboratorFullName: string;
};

import type { VacationtDetailsUiState } from "@app/modules/payroll/ui/pages/control-vacations/utils/vacations-details-view-state";
export type ControlModalVacationDetailsContentProps = {
  details: VacationtDetailsUiState;
};
