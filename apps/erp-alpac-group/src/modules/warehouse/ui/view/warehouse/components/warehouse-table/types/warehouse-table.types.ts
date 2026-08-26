import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";
import type { WarehouseTableRow } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/utils/skeleton-table";

export type WarehouseTableProps = {
  data: WarehouseTableRow[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewSections: (warehouse: WarehouseDto) => void;
  onAttachSubwarehouse: (warehouse: WarehouseDto) => void;
  isFetching?: boolean;
};

export type WarehouseColumnsOptions = {
  onViewSections: (warehouse: WarehouseDto) => void;
  onAttachSubwarehouse: (warehouse: WarehouseDto) => void;
  lastItemId?: string;
};
