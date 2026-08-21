import type { RackListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";

export type RacksTableProps = {
  data: RackListItemResponse[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewDetail: (rack: RackListItemResponse) => void;
  isFetching?: boolean;
};
