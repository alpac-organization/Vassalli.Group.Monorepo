import type {
  GetVacationsHistoryResponse,
  GetVacationsListResponse,
} from "@app/modules/payroll/domain/ApiContract/Responses/get-vacations-response";

export type ControlVacationsTableProps = {
  data: GetVacationsListResponse;
  onPageChange: (page: number) => void;
  isPending?: boolean;
  onViewDetails?: (row: GetVacationsHistoryResponse) => void;
  onGenerateDocument?: (row: GetVacationsHistoryResponse) => void;
};
