import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getQuoteAnalysisColumns } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-table/quote-analysis-columns";
import type { QuoteAnalysisTableProps } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-table/quote-analysis-table.types";

export function QuoteAnalysisTable({
   data,
   currentPage,
   totalRecords,
   pageSize,
   onPageChange,
   isFetching = false,
   onRowClick,
   onViewDetail,
   onSendToReview,
}: QuoteAnalysisTableProps) {

   const columns = useMemo(
      () => getQuoteAnalysisColumns(onViewDetail, onSendToReview),
      [onViewDetail, onSendToReview]
   );

   return (
      <div className="flex flex-col min-w-0 w-full overflow-x-auto">
         <DataTable
            title="Solicitudes de revisión"
            data={data}
            columns={columns}
            onRowClick={onRowClick}
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
