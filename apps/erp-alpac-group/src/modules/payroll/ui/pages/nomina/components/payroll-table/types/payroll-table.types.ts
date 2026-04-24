import type { GetCollaboratorsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborators.response";

export type PayrollTableProps = {
  rows: GetCollaboratorsResponse[];
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
};
