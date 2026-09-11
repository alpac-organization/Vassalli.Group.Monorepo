export type LotFilters = {
  searchTerm: string;
  filterStatus: string;
};

// Definimos un objeto vacío de filtros de tramo para ser reutilizado en los formularios de filtro,
// permitiendo inicializar, limpiar y resetear los valores fácilmente
export const EMPTY_LOT_FILTERS: LotFilters = {
  searchTerm: "",
  filterStatus: "",
};
