import { useMemo } from "react";

import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { usePurchaseOrderDetail } from "@app/modules/purchasing/ui/hooks/purchase/usePurchaseOrderDetail";
import { usePurchaseRequestProductsAll } from "@app/modules/purchasing/ui/hooks/purchase/usePurchaseRequestProductsAll";
import { buildPurchaseRequestProductMap } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

import {
  buildDocumentCodeBadges,
  buildOrderProducts,
  buildOrderSummary,
} from "../process-inventory-entry-modal.utils";

import type { ProcessInventoryEntryModalProps } from "../process-inventory-entry-modal.types";

type UseProcessInventoryEntryModalDataProps = Pick<
  ProcessInventoryEntryModalProps,
  "isOpen" | "order"
>;

export const useProcessInventoryEntryModalData = ({
  isOpen,
  order,
}: UseProcessInventoryEntryModalDataProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();

  const purchaseOrderId = isOpen ? (order?.purchase_order_id ?? "") : "";
  const purchaseRequestId = order?.purchase_request?.purchase_request_id ?? "";

  const { GetPurchaseOrderDetails } = usePurchaseOrderDetail({
    getPurchaseOrderDetailsPayload: isOpen
      ? {
          company_id: companyId,
          module_code: moduleCode,
          purchase_order_id: purchaseOrderId,
        }
      : undefined,
  });

  const purchaseRequestProductsQuery = usePurchaseRequestProductsAll({
    companyId,
    moduleCode,
    purchaseRequestId,
    enabled: isOpen,
  });

  const detail = GetPurchaseOrderDetails.data;
  const items = useMemo(() => detail?.items ?? [], [detail?.items]);

  const productByItemId = useMemo(
    () => buildPurchaseRequestProductMap(purchaseRequestProductsQuery.data),
    [purchaseRequestProductsQuery.data],
  );

  const products = useMemo(
    () => buildOrderProducts(items, productByItemId),
    [items, productByItemId],
  );

  const documentBadges = useMemo(
    () => buildDocumentCodeBadges(order, detail),
    [order, detail],
  );

  const summary = useMemo(
    () => buildOrderSummary(order, detail),
    [order, detail],
  );

  const isLoading =
    GetPurchaseOrderDetails.isPending || GetPurchaseOrderDetails.isFetching;

  const isError = GetPurchaseOrderDetails.isError;

  const errorMessage = isError
    ? getMappedError(GetPurchaseOrderDetails.error).description ||
      "No se encontró la orden de compra."
    : null;

  return {
    detail,
    items,
    products,
    documentBadges,
    summary,
    isLoading,
    isError,
    errorMessage,
    refetch: GetPurchaseOrderDetails.refetch,
  };
};
