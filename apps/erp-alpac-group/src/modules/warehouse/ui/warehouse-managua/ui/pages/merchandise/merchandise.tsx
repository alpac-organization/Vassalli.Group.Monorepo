import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { MerchandiseHeader } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-header/merchandise-header";
import { MerchandiseFiltersBar } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-filters/merchandise-filters";
import { MerchandiseTable } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-table/merchandise-table";
import {
  EMPTY_MERCHANDISE_FILTERS,
  type MerchandiseFilters,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/types/merchandise.types";
import { resolveDocumentNumberFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/utils/mapping-merchandise";
import { useMerchandise } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useMerchandise";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetMerchandiseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/merchandise/get-merchandise";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const PAGE_SIZE = 10;

export function MerchandisePage() {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<MerchandiseFilters>(
    EMPTY_MERCHANDISE_FILTERS,
  );

  const payloadGetMerchandise = useMemo<GetMerchandiseRequest>(() => {
    const documentNumbers = resolveDocumentNumberFilters(
      appliedFilters.document_number,
      appliedFilters.document_type,
    );

    return {
      company_id: companyId,
      module_code: moduleCode,
      driver_name: appliedFilters.driver_name.trim(),
      plate_number: appliedFilters.plate_number.trim(),
      document_type: appliedFilters.document_type.trim(),
      ducat_number: documentNumbers.ducat_number,
      customs_declaration_number: documentNumbers.customs_declaration_number,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
    };
  }, [companyId, moduleCode, appliedFilters, pageNumber]);

  const { GetMerchandiseRegister } = useMerchandise({ payloadGetMerchandise });
  const { data, isLoading, isFetching, isError, error } = GetMerchandiseRegister;

  const items = data?.data ?? [];
  const totalRecords = data?.total_count ?? 0;

  useEffect(() => {
    if (!isError || !error) return;
    const mappedError = getMappedError(error as ApiErrorResponse);
    handleRequestError(
      mappedError?.description || "Error al cargar la mercancía",
    );
  }, [isError, error, getMappedError, handleRequestError]);

  const handleApplyFilters = useCallback((filters: MerchandiseFilters) => {
    setAppliedFilters({
      document_number: filters.document_number.trim(),
      document_type: filters.document_type.trim(),
      plate_number: filters.plate_number.trim(),
      driver_name: filters.driver_name.trim(),
    });
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_MERCHANDISE_FILTERS);
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
      {isLoading && <Loader title="Cargando mercancía..." />}

      <MerchandiseHeader />

      <MerchandiseFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <MerchandiseTable
        data={items}
        currentPage={data?.page_number ?? pageNumber}
        totalRecords={totalRecords}
        pageSize={data?.page_size ?? PAGE_SIZE}
        onPageChange={handlePageChange}
        isFetching={isFetching}
      />

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>
    </m.div>
  );
}
