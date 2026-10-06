import type { OperationalOrderStatusType } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";

export interface OngoingOperationsFilters {
  code: string;
  customer_cif: string;
  status: OperationalOrderStatusType | "";
}

export interface SelectedOperationTarget {
  operation_order_id: string;
  po_code: string;
  customer_id?: string | null;
  customer_name?: string | null;
  customer_cif?: string | null;
  package_amount?: number | null;
  merchandise_weight?: number | null;
}
