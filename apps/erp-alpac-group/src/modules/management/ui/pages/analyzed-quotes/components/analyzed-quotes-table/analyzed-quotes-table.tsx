import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getAnalyzedQuotesColumns } from "./analyzed-quotes-columns";
import type { AnalyzedQuotesTableProps } from "./analyzed-quotes-table.types";

export function AnalyzedQuotesTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  isFetching = false,
  onViewDetail,
  processPurchaseOrder,
}: AnalyzedQuotesTableProps) {

  const columns = useMemo(
    () => getAnalyzedQuotesColumns(onViewDetail, processPurchaseOrder),
    [onViewDetail, processPurchaseOrder],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Cotizaciones analizadas"
        data={data}
        columns={columns}
        pagination={
          <Pagination
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={onPageChange}
            disabled={isFetching}
          />
        }
      />
    </div>
  );
}
