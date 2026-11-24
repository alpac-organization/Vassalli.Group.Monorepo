import { Badges, DataTable } from "@alpac/design-system";
import { InfoIcon } from "lucide-react";

import {
  DOCUMENT_CODE_BADGE_CLASS,
  DOCUMENT_CODE_BADGE_COLORS,
} from "../../process-inventory-entry-modal.constants";
import { OrderProductsCount } from "../order-products-count/order-products-count";

import type { TableColumn } from "@alpac/design-system";
import type { OrderProductRowModel } from "../../process-inventory-entry-modal.types";
import type { OrderProductsTableProps } from "./order-products-table.types";

const PRODUCT_TABLE_COLUMNS: TableColumn<OrderProductRowModel>[] = [
  {
    key: "productCode",
    label: "Código del producto",
    render: (row) => (
      <span
        className="inline-flex"
        title={`Código de producto: ${row.productCode}`}
      >
        <Badges
          label={row.productCode}
          color={DOCUMENT_CODE_BADGE_COLORS.product}
          className={DOCUMENT_CODE_BADGE_CLASS}
        />
      </span>
    ),
  },
  {
    key: "productName",
    label: "Producto",
    render: (row) => (
      <span className="block min-w-[14rem] max-w-[28rem] whitespace-normal [overflow-wrap:anywhere] text-sm font-medium text-slate-800 dark:text-slate-100">
        {row.productName}
      </span>
    ),
  },
  {
    key: "quantityLabel",
    label: "Cantidad",
    render: (row) => (
      <span className="flex w-full justify-center text-sm tabular-nums text-slate-700 dark:text-slate-200">
        {row.quantityLabel}
      </span>
    ),
  },
  {
    key: "unitPriceLabel",
    label: "Precio unitario",
    render: (row) => (
      <span className="flex w-full justify-center whitespace-nowrap text-sm tabular-nums text-slate-700 dark:text-slate-200">
        {row.unitPriceLabel}
      </span>
    ),
  },
  {
    key: "totalLabel",
    label: "Total",
    render: (row) => (
      <span className="flex w-full justify-center whitespace-nowrap text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {row.totalLabel}
      </span>
    ),
  },
  {
    key: "costCenterLabel",
    label: "Centro de costo",
    render: (row) => (
      <span
        className="inline-flex flex-col gap-0.5 whitespace-nowrap"
        title={row.costCenter?.description ?? undefined}
      >
        <Badges
          label={row.costCenterLabel}
          color="bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
          className="text-[12px]! px-2.5! py-1! font-semibold! tracking-wide"
        />

        {row.costCenter?.code && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Código: {row.costCenter.code}
          </span>
        )}
      </span>
    ),
  },
];

export const OrderProductsTable = function ({
  rows,
  hasMixedCurrency = false,
}: OrderProductsTableProps) {
  return (
    <section
      aria-label="Productos de la orden de compra"
      className="flex flex-col gap-2"
    >
      <div className="[&>div]:h-auto [&>div]:flex-none">
        <DataTable<OrderProductRowModel>
          title="Productos"
          data={rows}
          columns={PRODUCT_TABLE_COLUMNS}
          getRowKey={(row) => row.purchaseOrderItemId}
          maxHeight="none"
          toolbarEnd={<OrderProductsCount itemCount={rows.length} />}
        />
      </div>

      {hasMixedCurrency && (
        <p className="m-0 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
          <InfoIcon size={14} className="mt-0.5 shrink-0" aria-hidden />
          Los ítems tienen monedas distintas; cada precio se muestra con su
          moneda.
        </p>
      )}
    </section>
  );
};
