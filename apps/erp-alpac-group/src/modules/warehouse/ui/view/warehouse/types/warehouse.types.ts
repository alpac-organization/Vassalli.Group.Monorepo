export type WarehouseFilters = {
  warehouse_code: string;
  warehouse_type: string;
  filterStatus: string;
};

export const EMPTY_WAREHOUSE_FILTERS: WarehouseFilters = {
  warehouse_code: "",
  warehouse_type: "",
  filterStatus: "",
};
