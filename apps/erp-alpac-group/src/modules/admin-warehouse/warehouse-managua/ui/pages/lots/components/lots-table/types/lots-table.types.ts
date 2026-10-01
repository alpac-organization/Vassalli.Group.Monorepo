import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { LotCapacitiesResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-capacities-res";

export type LotsTableProps = {
  data: LotListItemResponse[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewDetail: (lot: LotListItemResponse) => void;
  isFetching?: boolean;
  capacitiesByLotId?: Record<string, LotCapacitiesResponse | undefined>;
  capacitiesLoading?: boolean;
};
