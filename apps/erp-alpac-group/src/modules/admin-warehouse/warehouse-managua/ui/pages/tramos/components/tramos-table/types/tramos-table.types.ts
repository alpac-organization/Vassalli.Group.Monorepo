import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";

export type TramosTableProps = {
  data: LotListItemResponse[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewDetail: (lot: LotListItemResponse) => void;
  isFetching?: boolean;
};
