import { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import { PriorityLevelEnum } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import {
  MIN_SUPPLIERS_CRITICAL_REQUISITION,
  MIN_SUPPLIERS_PER_PRODUCT,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-products-modal/quote-product-modal.types";

type QuotationItemWithSupplier = {
  purchase_request_item_id: string;
  supplier_id: string;
};

export function resolveMinSuppliersPerProduct(
  requestType?: string | number | null,
  priorityLevel?: string | number | null,
): number {
  const normalizedType = String(requestType ?? "").trim().toLowerCase();
  const normalizedPriority = String(priorityLevel ?? "").trim().toLowerCase();

  const isRequisition =
    normalizedType === PurchaseRequestEnum.Requisition.textValue.toLowerCase() ||
    normalizedType === String(PurchaseRequestEnum.Requisition.value);

  const isCritical =
    normalizedPriority === PriorityLevelEnum.Critical.textValue.toLowerCase() ||
    normalizedPriority === String(PriorityLevelEnum.Critical.value);

  return isRequisition && isCritical
    ? MIN_SUPPLIERS_CRITICAL_REQUISITION
    : MIN_SUPPLIERS_PER_PRODUCT;
}

/** Valida si cada producto cotizado tiene al menos `minSuppliers` proveedores distintos. */
export function hasEnoughSuppliersPerProduct(
  items: QuotationItemWithSupplier[],
  minSuppliers = MIN_SUPPLIERS_PER_PRODUCT,
): boolean {
  if (items.length === 0) return false;

  const suppliersByItemId = new Map<string, Set<string>>();

  for (const item of items) {
    const itemId = item.purchase_request_item_id?.trim();
    const supplierId = item.supplier_id?.trim();
    if (!itemId || !supplierId) continue;

    const suppliers = suppliersByItemId.get(itemId) ?? new Set<string>();
    suppliers.add(supplierId);
    suppliersByItemId.set(itemId, suppliers);
  }

  if (suppliersByItemId.size === 0) return false;

  for (const suppliers of suppliersByItemId.values()) {
    if (suppliers.size < minSuppliers) return false;
  }

  return true;
}
