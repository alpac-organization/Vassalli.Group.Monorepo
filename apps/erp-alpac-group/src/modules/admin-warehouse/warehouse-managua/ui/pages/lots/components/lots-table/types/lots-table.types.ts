import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";

export type LotsTableProps = {
  data: LotDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  isFetching?: boolean;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  selectedLot?: LotDto | null;
  onPageChange: (page: number) => void;
  onViewDetail: (lot: LotDto) => void;
  onSelectRow?: (lot: LotDto) => void;
};
