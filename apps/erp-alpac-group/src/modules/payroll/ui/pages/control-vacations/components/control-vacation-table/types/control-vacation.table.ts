import type { VacationAccruals } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";

export type ControlVacationsTableProps = {
  rows: VacationAccruals[];
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
//   onViewDetails?: (item: VacationAccruals) => void;
};
