import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";

export type RacksTableProps = {
  data: RackDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  isFetching?: boolean;
  height?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  onSelectRow?: (rack: RackDto) => void;
  onPageChange: (page: number) => void;
  onViewPositions: (rack: RackDto) => void;
  onUpdateRack: (rack: RackDto) => void;
  onDeleteRack: (rack: RackDto) => void;
};

export type RacksColumnsOptions = {
  onViewPositions: (rack: RackDto) => void;
  onUpdateRack: (rack: RackDto) => void;
  onDeleteRack: (rack: RackDto) => void;
  lastItemId?: string;
};
