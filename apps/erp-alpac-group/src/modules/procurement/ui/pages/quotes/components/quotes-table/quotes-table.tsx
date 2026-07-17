import { useMemo } from "react";
import {
  Button,
  DataTable,
  Pagination,
  type TableColumn,
} from "@alpac/design-system";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import type { GetHistoryQuotesView } from "@app/modules/procurement/ui/pages/quotes/types/quotes-view.types";
import type { QuotesTableProps } from "@app/modules/procurement/ui/pages/quotes/components/quotes-table/quotes-table.types";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

const buildColumns = (
  onViewDetail: (row: GetHistoryQuotesView) => void,
): TableColumn<GetHistoryQuotesView>[] => [
  {
    key: "made_by",
    label: "Responsable",
    render: (row) => row.made_by?.trim() || "—",
  },
  {
    key: "quote_date",
    label: "Fecha",
    render: (row) => formatDateToSpanishWords(row.quote_date ?? ""),
  },
  {
    key: "approximate_cost",
    label: "Costo aproximado",
    render: (row) =>
      formatCurrency(row.approximate_cost ?? 0, row.currency ?? "NIO") ?? "—",
  },
  {
    key: "observations",
    label: "Observaciones",
    render: (row) => (
      <span className="line-clamp-2 max-w-xs text-neutral-700 dark:text-neutral-300">
        {row.observations?.trim() || "—"}
      </span>
    ),
  },
  {
    key: "suppliers_count",
    label: "Proveedores",
    render: (row) => row.additional_data?.quotes_made?.length ?? 0,
  },
  {
    key: "actions",
    label: "Acciones",
    render: (row) => (
      <Button
        type="button"
        label="Ver detalle"
        size="small"
        className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
        onClick={(event) => {
          event.stopPropagation();
          onViewDetail(row);
        }}
      />
    ),
  },
];

export function QuotesTable({ data, onViewDetail }: QuotesTableProps) {
  const columns = useMemo(() => buildColumns(onViewDetail), [onViewDetail]);
  return (
    <DataTable
      title="Historial de cotizaciones"
      data={data}
      columns={columns}
      pagination={
        <Pagination
          currentPage={1}
          pageSize={10}
          totalRecords={data.length}
          onPageChange={() => {}}
        />
      }
    />
  );
}
