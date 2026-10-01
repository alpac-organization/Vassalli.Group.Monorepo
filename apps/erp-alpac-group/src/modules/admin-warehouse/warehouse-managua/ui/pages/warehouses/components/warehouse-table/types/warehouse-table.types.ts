import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";

export type WarehouseTableProps = {
  data: WarehouseDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewSections: (warehouse: WarehouseDto) => void;
  onViewDetails: (warehouse: WarehouseDto) => void;
  onUpdateWarehouse: (warehouse: WarehouseDto) => void;
  onSelectRow: (warehouse: WarehouseDto) => void;
  selectedWarehouse?: WarehouseDto | null;
  isFetching?: boolean;
};

export type WarehouseColumnsOptions = {
  onViewSections: (warehouse: WarehouseDto) => void;
  onViewDetails: (warehouse: WarehouseDto) => void;
  onUpdateWarehouse: (warehouse: WarehouseDto) => void;
  lastItemId?: string;
};
