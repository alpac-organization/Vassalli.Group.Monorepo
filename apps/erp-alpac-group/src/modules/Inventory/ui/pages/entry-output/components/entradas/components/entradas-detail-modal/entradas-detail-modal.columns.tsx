import { Badges } from "@alpac/design-system";

import { BADGE_COLORS, COMPACT_BADGE_CLASS } from "./entradas-detail-modal.constants";
import {
  EMPTY_VALUE,
  displayText,
  formatCurrency,
  formatQuantity,
} from "./entradas-detail-modal.utils";

import type { TableColumn } from "@alpac/design-system";
import type {
  InventoryEntryItemDetail,
  InventoryEntryPurchaseRequestItem,
} from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";
import type { CostCenterInformation } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

const MUTED_CELL_CLASS = "text-sm text-slate-400 dark:text-slate-500";
const NUMERIC_CELL_CLASS =
  "inline-block whitespace-nowrap text-left text-sm tabular-nums text-slate-700 dark:text-slate-200";

const renderEmptyCell = () => <span className={MUTED_CELL_CLASS}>{EMPTY_VALUE}</span>;

const renderBadgeCell = (label: string | null, color: string) =>
  label ? (
    <span className="inline-flex whitespace-nowrap" title={label}>
      <Badges label={label} color={color} className={COMPACT_BADGE_CLASS} />
    </span>
  ) : (
    renderEmptyCell()
  );

const renderCostCenterCell = ({
  name,
  code,
  costCenterInfo,
}: {
  name?: string | null;
  code?: string | null;
  costCenterInfo?: CostCenterInformation | null;
}) => {
  const resolvedName = costCenterInfo?.cost_center_name ?? name ?? null;
  const resolvedCode =
    costCenterInfo?.cost_center_code !== null && costCenterInfo?.cost_center_code !== undefined
      ? String(costCenterInfo.cost_center_code)
      : (code ?? null);
  const label = resolvedName ?? resolvedCode;

  if (!label) {
    return (
      <span className="inline-flex whitespace-nowrap">
        <Badges label="Por asignar" color={BADGE_COLORS.neutral} className={COMPACT_BADGE_CLASS} />
      </span>
    );
  }

  return (
    <span
      className="inline-flex flex-col gap-0.5 whitespace-nowrap"
      title={costCenterInfo?.description ?? label}
    >
      <Badges label={label} color={BADGE_COLORS.costCenter} className={COMPACT_BADGE_CLASS} />
      {resolvedCode && resolvedName && (
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Código: {resolvedCode}
        </span>
      )}
    </span>
  );
};

const renderProductNameCell = (name: string | null) => (
  <span className="block w-max max-w-[15rem] whitespace-normal text-sm font-medium text-slate-800 [overflow-wrap:anywhere] dark:text-slate-100">
    {displayText(name)}
  </span>
);

const renderWrappedTextCell = (value: string | null) => (
  <span className="block max-w-[18rem] whitespace-normal text-sm text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">
    {displayText(value)}
  </span>
);

export const getItemTotal = (item: InventoryEntryItemDetail): number =>
  (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);

export const ORDER_ITEMS_COLUMNS: TableColumn<InventoryEntryItemDetail>[] = [
  {
    key: "product_code",
    label: "Código",
    render: (item) =>
      renderBadgeCell(item.product_code?.toUpperCase() ?? null, BADGE_COLORS.product),
  },
  {
    key: "product_name",
    label: "Producto",
    render: (item) => renderProductNameCell(item.product_name),
  },
  {
    key: "quantity",
    label: "Cantidad",
    render: (item) => (
      <span className={NUMERIC_CELL_CLASS}>
        {formatQuantity(item.quantity, item.unit_measure_symbol ?? item.unit_measure_name)}
      </span>
    ),
  },
  {
    key: "unit_price",
    label: "Precio unitario",
    render: (item) => <span className={NUMERIC_CELL_CLASS}>{formatCurrency(item.unit_price)}</span>,
  },
  {
    key: "total",
    label: "Total",
    render: (item) => (
      <span className="inline-block whitespace-nowrap text-left text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {formatCurrency(getItemTotal(item))}
      </span>
    ),
  },
  {
    key: "cost_center_name",
    label: "Centro de costo destino",
    render: (item) =>
      renderCostCenterCell({
        name: item.cost_center_name,
        code: item.cost_center_code,
        costCenterInfo: item.cost_center_information,
      }),
  },
  {
    key: "supplier_name",
    label: "Proveedor",
    render: (item) => renderWrappedTextCell(item.supplier_name),
  },
  {
    key: "quotation_id",
    label: "Cotización",
    render: (item) =>
      renderBadgeCell(item.quotation_id ? "Aprobada" : null, BADGE_COLORS.quotation),
  },
];

export const REQUEST_ITEMS_COLUMNS: TableColumn<InventoryEntryPurchaseRequestItem>[] = [
  {
    key: "product_code",
    label: "Código",
    render: (item) =>
      renderBadgeCell(item.product_code?.toUpperCase() ?? null, BADGE_COLORS.product),
  },
  {
    key: "product_name",
    label: "Producto",
    render: (item) => renderProductNameCell(item.product_name),
  },
  {
    key: "quantity",
    label: "Cantidad",
    render: (item) => (
      <span className={NUMERIC_CELL_CLASS}>
        {formatQuantity(item.quantity, item.unit_measure_symbol ?? item.unit_measure_name)}
      </span>
    ),
  },
  {
    key: "cost_center_name",
    label: "Centro de costo destino",
    render: (item) =>
      renderCostCenterCell({
        name: item.cost_center_name,
        code: item.cost_center_code,
        costCenterInfo: item.cost_center_information,
      }),
  },
  {
    key: "description",
    label: "Descripción",
    render: (item) => renderWrappedTextCell(item.description),
  },
];
