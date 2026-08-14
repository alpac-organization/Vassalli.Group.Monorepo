import type { PendingAssignmentItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-pending-assignments";

export type PendingAssignmentsTableProps = {
  data: PendingAssignmentItem[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onAssignClick: (item: PendingAssignmentItem) => void;
  isFetching?: boolean;
};