import type {
  GetVacationsHistoryResponse,
  GetVacationsListResponse,
} from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";

export type ControlVacationsTableProps = {
  data: GetVacationsListResponse;
  onPageChange: (page: number) => void;
  isPending?: boolean;
  onViewDetails?: (row: GetVacationsHistoryResponse) => void;
};
