import type { VacationAccruals } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

export type VacationAccrualPdfProps = {
  data: VacationAccruals[];
  generatedAt: string;
  preparedBy: {
    name: string;
    role: string;
  };
};
