export type MerchandiseFilters = {
  service_order_code: string;
  document_type: string;
  plate_number: string;
  driver_name: string;
};

export const EMPTY_MERCHANDISE_FILTERS: MerchandiseFilters = {
  service_order_code: "",
  document_type: "",
  plate_number: "",
  driver_name: "",
};
