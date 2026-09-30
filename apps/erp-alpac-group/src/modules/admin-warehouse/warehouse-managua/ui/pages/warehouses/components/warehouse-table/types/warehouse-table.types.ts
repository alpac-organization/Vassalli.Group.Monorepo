import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";

export type WarehouseTableProps = {
  data: WarehouseDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewSections: (warehouse: WarehouseDto) => void;
  onViewDetails: (warehouse: WarehouseDto) => void;
  isFetching?: boolean;
};

export type WarehouseColumnsOptions = {
  onViewSections: (warehouse: WarehouseDto) => void;
  onViewDetails: (warehouse: WarehouseDto) => void;
  lastItemId?: string;
};
