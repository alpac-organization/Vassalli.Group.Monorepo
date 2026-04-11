import type { ControlVacationHistoryRow } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
export type ControlVacationsTableProps = {
  data: ControlVacationHistoryRow[];
  onViewDetails?: (row: ControlVacationHistoryRow) => void;
  onGenerateDocument?: (row: ControlVacationHistoryRow) => void;
};
