import type { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";

export interface SalidasFilters {
  output_code?: string;
  supply_request_code?: string;
  fuel_request_code?: string;
  request_type?: string;
  status?: InventoryOutputsStatus | null;
  reason_inventory_removal_id?: string;

  page_number?: number;
  page_size?: number;
}

export const DEFAULT_SALIDAS_FILTERS: SalidasFilters = {
  page_number: 1,
  page_size: 10,
};