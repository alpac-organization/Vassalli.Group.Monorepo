import type { QuoteDetails } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";

export type QuoteAnalysisTableProps = {
  data: QuoteDetails[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onRowClick?: (row: QuoteDetails) => void;
};
