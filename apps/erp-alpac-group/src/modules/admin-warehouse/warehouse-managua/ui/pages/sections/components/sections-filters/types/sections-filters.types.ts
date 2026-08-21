export type SectionsFiltersProps = {
  onApply: (filters: SectionFilters) => void;
  onClear: () => void;
  defaultValues?: SectionFilters;
};
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
