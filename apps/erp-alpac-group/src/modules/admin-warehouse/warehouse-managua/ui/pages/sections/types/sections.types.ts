export type SectionFilters = {
  searchTerm: string;
  filterType: string;
  filterStorage: string;
  filterStatus: string;
};

export const EMPTY_SECTION_FILTERS: SectionFilters = {
  searchTerm: "",
  filterType: "",
  filterStorage: "",
  filterStatus: "",
};
