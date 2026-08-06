export type MerchandiseFilters = {
  document_number: string;
  document_type: string;
  plate_number: string;
  driver_name: string;
};

export const EMPTY_MERCHANDISE_FILTERS: MerchandiseFilters = {
  document_number: "",
  document_type: "",
  plate_number: "",
  driver_name: "",
};
