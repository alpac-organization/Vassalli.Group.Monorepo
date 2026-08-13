import type { RequisitionAccountingReviewDto } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";

export type QuoteAnalysisTableProps = {
  data: RequisitionAccountingReviewDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onRowClick?: (row: RequisitionAccountingReviewDto) => void;
};
