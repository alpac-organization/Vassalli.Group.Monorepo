import { useCallback, useMemo, useState } from "react";
import { m } from "framer-motion";
import { Breadcrumb } from "@alpac/design-system";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { QuotesPageHeader } from "@app/modules/purchasing/ui/pages/quotes/components/quotes-page-header/quotes-page-header";
import { useQuoteAnalysis } from "@app/modules/finance/ui/hooks/quotes-analysis/useQuoteAnalysis";
import type { accountingReviewStatusType } from "@app/modules/finance/enum/analysis-quotation/accounting-review-status";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { QuoteAnalysisFiltersValues } from "@app/modules/finance/ui/pages/quote-analisys/components/quote-analysis-filters/types/quote-analysis-filters.types";
import { QuoteAnalysisFilters } from "./components/quote-analysis-filters/quote-analysis-filters";
import { QuoteAnalysisTable } from "./components/quote-analysis-table/quote-analysis-table";

const PAGE_SIZE = 10;

export function QuoteAnalisys() {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { companyId, moduleCode } = useUserStore();
  const [pageNumber, setPageNumber] = useState(1);
  const [appliedStatus, setAppliedStatus] = useState<
    accountingReviewStatusType | ""
  >("");
  const [appliedAreaId, setAppliedAreaId] = useState("");

  const payloadGetQuoteAnalysis = useMemo<GetQuotesAnalysisRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      ...(appliedStatus && { status: appliedStatus }),
      ...(appliedAreaId && { area_id: appliedAreaId }),
    }),
    [companyId, moduleCode, pageNumber, appliedStatus, appliedAreaId],
  );

  const { GetQuoteAnalysis } = useQuoteAnalysis({
    payloadGetQuoteAnalysis,
  });

  const { data: quoteAnalysis, isLoading, isFetching } = GetQuoteAnalysis;
  const quotes = quoteAnalysis?.data ?? [];
  const totalRecords = quoteAnalysis?.total ?? 0;

  const handleApplyFilters = useCallback((filters: QuoteAnalysisFiltersValues) => {
    setAppliedStatus(filters.status);
    setAppliedAreaId(filters.area_id);
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedStatus("");
    setAppliedAreaId("");
    setPageNumber(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {isLoading && <Loader title="Cargando análisis de cotizaciones..." />}

      <div className="flex justify-start">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `${baseUrl}/`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Análisis comparativo",
              url: `${baseUrl}/finance/analisys`,
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <QuotesPageHeader
        title="Análisis comparativo"
        subtitle="Revise y compare las solicitudes de cotización enviadas a revisión contable"
      />

      <QuoteAnalysisFilters
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <QuoteAnalysisTable
        data={quotes}
        currentPage={quoteAnalysis?.page_number ?? pageNumber}
        totalRecords={totalRecords}
        pageSize={quoteAnalysis?.page_size ?? PAGE_SIZE}
        onPageChange={handlePageChange}
        isFetching={isFetching}
      />
    </m.div>
  );
}
