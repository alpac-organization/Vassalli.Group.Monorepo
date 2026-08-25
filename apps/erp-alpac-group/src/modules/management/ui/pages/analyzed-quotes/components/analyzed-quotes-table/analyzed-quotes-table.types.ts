import type { RequisitionManagementReviewDto } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";

export type AnalyzedQuotesTableProps = {
  data: RequisitionManagementReviewDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onViewDetail?: (row: RequisitionManagementReviewDto) => void;
  onSendTo?: (row: RequisitionManagementReviewDto) => void;
};
