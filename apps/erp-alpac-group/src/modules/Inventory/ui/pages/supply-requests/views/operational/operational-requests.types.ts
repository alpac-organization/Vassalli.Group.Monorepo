export interface OperationalRequestsFilters {
  code?: string;
  work_area_id?: string;
  warehouse_id?: string;
  branch_id?: string;
  operational_order_id?: string;
  requested_by_user_id?: string;
  reason_use?: string;

  page_number?: number;
  page_size?: number;
}

export const DEFAULT_OPERATIONAL_FILTERS: OperationalRequestsFilters = {
  page_number: 1,
  page_size: 10,
};
