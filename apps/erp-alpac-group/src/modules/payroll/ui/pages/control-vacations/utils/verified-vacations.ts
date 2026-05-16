import type { VacationReportType } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";

export const isValidVacationReportType = (
  value: unknown,
): value is VacationReportType =>
  value === "VacationAccrual" || value === "VacationRequest";
