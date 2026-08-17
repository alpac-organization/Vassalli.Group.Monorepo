import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";

export type WarehouseTableProps = {
  data: GetWarehousesResponse[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewSections: (warehouse: GetWarehousesResponse) => void;
  isFetching?: boolean;
};
