import type { GetPurchaseOrderDetailsResponse, PurchaseOrderDetailItem } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { PurchaseOrderReportCurrency } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

import { PurchaseOrderStatusEnum } from "@app/modules/purchasing/domain/enums/purchase-order-status.enum";
import {
  formatPurchaseOrderReportMoney,
  resolveAcceptedQuoteCurrency,
} from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/utils/resolve-purchase-order-report-currency";

import {
  DOCUMENT_CODE_BADGE_COLORS,
  QUANTITY_FORMATTER,
} from "./process-inventory-entry-modal.constants";

import type {
  DocumentCodeBadgeModel,
  OrderProductRowModel,
  OrderSummaryModel,
} from "./process-inventory-entry-modal.types";

const EMPTY = "—";

const resolveItemCurrency = (
  item: PurchaseOrderDetailItem,
  productByItemId: ReadonlyMap<string, PurchaseRequestProductInformation>,
): PurchaseOrderReportCurrency | undefined => {
  const requestItemId = item.purchase_request_item_id?.trim();
  if (!requestItemId) return undefined;

  return resolveAcceptedQuoteCurrency(productByItemId.get(requestItemId));
};

const resolveItemUnitPrice = (item: PurchaseOrderDetailItem): number =>
  item.unit_price ?? item.quotation?.price_unit ?? 0;

const resolveItemTotal = (item: PurchaseOrderDetailItem): number =>
  item.quotation?.price_total ?? item.quantity * resolveItemUnitPrice(item);

export interface OrderProductsComputation {
  rows: OrderProductRowModel[];
  hasMixedCurrency: boolean;
}

export const buildOrderProducts = (
  items: PurchaseOrderDetailItem[],
  productByItemId: ReadonlyMap<string, PurchaseRequestProductInformation>,
): OrderProductsComputation => {
  const computed = items.map((item) => ({
    item,
    currency: resolveItemCurrency(item, productByItemId),
    total: resolveItemTotal(item),
  }));

  const resolvedCurrencies = computed
    .map((entry) => entry.currency)
    .filter((currency): currency is PurchaseOrderReportCurrency => Boolean(currency));

  const distinctCurrencies = new Set(resolvedCurrencies);

  const hasMixedCurrency =
    distinctCurrencies.size > 1 ||
    (resolvedCurrencies.length > 0 && resolvedCurrencies.length < computed.length);

  const rows = computed.map(({ item, currency, total }) => ({
    purchaseOrderItemId: item.purchase_order_item_id,
    productName: item.product_name ?? EMPTY,
    productCode: item.product_code ?? EMPTY,
    quantityLabel: QUANTITY_FORMATTER.format(item.quantity ?? 0),
    unitPriceLabel: formatPurchaseOrderReportMoney(
      resolveItemUnitPrice(item),
      currency,
    ),
    totalLabel: formatPurchaseOrderReportMoney(total, currency),
    costCenterLabel:
      item.cost_center_information?.cost_center_name ??
      item.cost_center_information?.cost_center_code ??
      "Por asignar",
  }));

  return {
    rows,
    hasMixedCurrency,
  };
};

export const buildDocumentCodeBadges = (
  order: GetPurchaseOrdersResponse | null,
  detail: GetPurchaseOrderDetailsResponse | undefined,
): DocumentCodeBadgeModel[] => [
  {
    label: "Orden de compra",
    value: order?.purchase_order_code ?? detail?.purchase_order_code ?? EMPTY,
    color: DOCUMENT_CODE_BADGE_COLORS.order,
  },
  {
    label: "Solicitud",
    value: order?.purchase_request?.code ?? EMPTY,
    color: DOCUMENT_CODE_BADGE_COLORS.request,
  },
];

export const buildOrderSummary = (
  order: GetPurchaseOrdersResponse | null,
  detail: GetPurchaseOrderDetailsResponse | undefined,
): OrderSummaryModel => {
  const sentBy = detail?.sent_by_user_information ?? order?.sent_by_user_information ?? null;

  return {
    orderCode: detail?.purchase_order_code ?? order?.purchase_order_code ?? EMPTY,
    requestCode: order?.purchase_request?.code ?? EMPTY,
    supplierName: detail?.supplier_name ?? order?.supplier_name ?? EMPTY,
    status:
      detail?.status ??
      order?.status ??
      PurchaseOrderStatusEnum.Pending.textValue,
    sentToReviewAt: detail?.sent_to_review_at ?? order?.sent_to_review_at ?? null,
    comments: detail?.comments ?? order?.comments ?? null,
    sentBy,
    senderWorkArea: sentBy?.work_area_information?.work_area_name ?? null,
  };
};
