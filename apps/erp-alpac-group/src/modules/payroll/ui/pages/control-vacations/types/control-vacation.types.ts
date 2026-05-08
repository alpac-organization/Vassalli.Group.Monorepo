import type { VacationReportType } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";

export type StoredControlVacationsSelection = {
  type: VacationReportType;
  branch_id: string;
};
