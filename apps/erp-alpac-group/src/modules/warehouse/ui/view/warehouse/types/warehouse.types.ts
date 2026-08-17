export type WarehouseFilters = {
  searchTerm: string;
  filterType: string;
  filterStatus: string;
};

export const EMPTY_WAREHOUSE_FILTERS: WarehouseFilters = {
  searchTerm: "",
  filterType: "",
  filterStatus: "",
};
