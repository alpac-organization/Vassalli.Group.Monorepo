import { useCallback, useMemo, useState } from "react";
import { m } from "framer-motion";
import { Breadcrumb } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { QuotesPageHeader } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header";
import { useManagement } from "@app/modules/management/ui/hooks/useManagement";
import { AnalyzedQuotesTable } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quotes-table/analyzed-quotes-table";
import type { GetRequisitionManagementReviewsRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-reviews";
import type { RequisitionManagementReviewDto } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";

const PAGE_SIZE = 10;

export const AnalyzedQuotes = () => {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { companyId, moduleCode } = useUserStore();
  const [pageNumber, setPageNumber] = useState(1);

  const payloadGetRequisitionManagementReviews =
    useMemo<GetRequisitionManagementReviewsRequest>(
      () => ({
        company_id: companyId,
        module_code: moduleCode,
        page_number: pageNumber,
        page_size: PAGE_SIZE,
      }),
      [companyId, moduleCode, pageNumber],
    );

  const { GetRequisitionManagementReviews } = useManagement({
    payloadGetRequisitionManagementReviews,
  });

  const {
    data: managementReviews,
    isLoading,
    isFetching,
  } = GetRequisitionManagementReviews;

  const quotes = managementReviews?.data ?? [];
  const totalRecords = managementReviews?.total ?? 0;

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleViewDetail = useCallback(
    (row: RequisitionManagementReviewDto) => {
      navigate(
        `${baseUrl}/management/analyzed-quotes/${row.requisition_management_review_id}`,
      );
    },
    [navigate, baseUrl],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {isLoading && <Loader title="Cargando cotizaciones analizadas..." />}

      <div className="flex justify-start">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `${baseUrl}/`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Cotizaciones analizadas",
              url: `${baseUrl}/management/analyzed-quotes`,
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <QuotesPageHeader
        title="Cotizaciones analizadas"
        subtitle="Revise las solicitudes de cotización enviadas a revisión gerencial"
      />

      <AnalyzedQuotesTable
        data={quotes}
        currentPage={managementReviews?.page_number ?? pageNumber}
        totalRecords={totalRecords}
        pageSize={managementReviews?.page_size ?? PAGE_SIZE}
        onPageChange={handlePageChange}
        isFetching={isFetching}
        onViewDetail={handleViewDetail}
      />
    </m.div>
  );
};
