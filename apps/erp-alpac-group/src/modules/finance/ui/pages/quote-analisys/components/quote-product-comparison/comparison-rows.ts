import type { LucideIcon } from "lucide-react";
import {
  Award,
  Calendar,
  Clock,
  Hash,
  NotebookText,
  Package,
  ShieldCheck,
  Star,
  Tag,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { formatTimeTypeLabel } from "@app/core/enums/time-type.enum";
import {
  resolveInventoryAvailabilityLabel,
  resolvePaymentMethodLabel,
  resolveProductQualityLabel,
} from "@app/modules/purchasing/domain/utils/quotation-label.utils";
import type {
  PurchaseRequestProductQuotation,
  PurchaseRequestSupplierProduct,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import {
  formatQuoteMoney,
  getQuoteSubtotal,
  getQuoteTotalPrice,
} from "@app/modules/finance/ui/pages/quote-analisys/components/quote-product-comparison/quote-product-comparison.utils";

export type ComparisonRow = {
  key: string;
  label: string;
  icon: LucideIcon;
  getValue: (
    quote: PurchaseRequestProductQuotation,
    supplierProducts?: PurchaseRequestSupplierProduct[],
  ) => string;
  emphasize?: boolean;
  stackOnCard?: boolean;
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    key: "ruc",
    label: "RUC / ID",
    icon: Hash,
    getValue: (quote) =>
      quote.supplier_information?.identification_number?.trim() || "—",
  },
  {
    key: "provider",
    label: "Proveedor",
    icon: User,
    getValue: (quote) =>
      quote.supplier_information?.suppliers_legal_name?.trim() || "—",
  },
  {
    key: "justification",
    label: "Justificación",
    icon: NotebookText,
    getValue: (quote) => quote.supplier_selection_justification?.trim() || "—",
    stackOnCard: true,
  },
  {
    key: "brand",
    label: "Marca / producto",
    icon: Tag,
    getValue: (quote) => quote.brand_product?.trim() || "—",
  },
  {
    key: "unit_price",
    label: "Precio ",
    icon: Package,
    getValue: (quote, supplierProducts) =>
      formatQuoteMoney(quote.price_unit, quote, supplierProducts),
  },
  {
    key: "subtotal",
    label: "Subtotal",
    icon: Package,
    getValue: (quote, supplierProducts) =>
      formatQuoteMoney(getQuoteSubtotal(quote), quote, supplierProducts),
  },
  {
    key: "iva",
    label: "IVA",
    icon: Package,
    getValue: (quote, supplierProducts) =>
      formatQuoteMoney(quote.iva, quote, supplierProducts),
  },
  {
    key: "ir",
    label: "IR",
    icon: Package,
    getValue: (quote, supplierProducts) =>
      formatQuoteMoney(quote.ir, quote, supplierProducts),
  },
  {
    key: "imi",
    label: "IMI",
    icon: Package,
    getValue: (quote, supplierProducts) =>
      formatQuoteMoney(quote.imi, quote, supplierProducts),
  },
  {
    key: "total",
    label: "Precio total",
    icon: Package,
    getValue: (quote, supplierProducts) =>
      formatQuoteMoney(getQuoteTotalPrice(quote), quote, supplierProducts),
    emphasize: true,
  },
  {
    key: "delivery_time_type",
    label: "Tipo de entrega",
    icon: Truck,
    getValue: (quote) => formatTimeTypeLabel(quote.delivery_time_type),
  },
  {
    key: "delivery_time",
    label: "Tiempo de entrega",
    icon: Clock,
    getValue: (quote) =>
      quote.delivery_time == null ? "—" : String(quote.delivery_time),
  },
  {
    key: "warranty_period",
    label: "Período de garantía",
    icon: ShieldCheck,
    getValue: (quote) =>
      quote.warranty_period == null ? "—" : String(quote.warranty_period),
  },
  {
    key: "warranty_period_time_type",
    label: "Tipo de garantía",
    icon: Award,
    getValue: (quote) => formatTimeTypeLabel(quote.warranty_period_time_type),
  },
  {
    key: "quality",
    label: "Calidad",
    icon: Star,
    getValue: (quote) => resolveProductQualityLabel(quote.product_quality),
  },
  {
    key: "inventory",
    label: "Inventario",
    icon: Package,
    getValue: (quote) => resolveInventoryAvailabilityLabel(quote),
  },
  {
    key: "payment",
    label: "Método de pago",
    icon: Wallet,
    getValue: (quote) =>
      resolvePaymentMethodLabel(
        quote.payment_method_type ??
          (typeof quote.payment_method === "string"
            ? quote.payment_method
            : null),
      ),
  },
  {
    key: "date",
    label: "Fecha de cotización",
    icon: Calendar,
    getValue: (quote) =>
      quote.quote_date ? formatDateToSpanishWords(quote.quote_date) : "—",
  },
];
