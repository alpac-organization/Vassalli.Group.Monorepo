import type { WarehouseAssignmentListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignments";

export type AssignmentsTableProps = {
  data: WarehouseAssignmentListItem[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDetailClick: (item: WarehouseAssignmentListItem) => void;
  isFetching?: boolean;
};