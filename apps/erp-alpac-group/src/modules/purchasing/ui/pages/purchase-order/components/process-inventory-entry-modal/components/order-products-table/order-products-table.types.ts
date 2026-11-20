import type { OrderProductRowModel } from "../../process-inventory-entry-modal.types";

export interface OrderProductsTableProps {
  rows: OrderProductRowModel[];
  hasMixedCurrency?: boolean;
}
