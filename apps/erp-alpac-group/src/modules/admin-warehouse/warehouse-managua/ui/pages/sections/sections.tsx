import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { LayoutGrid } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { SectionsHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-header/sections-header";
import { SectionsFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/sections-filters";
import { SectionsTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/sections-table";
import { SectionModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/section-modal";
import {
  EMPTY_SECTION_FILTERS,
  type SectionFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/types/sections.types";
import { filterSections } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/utils/filter-sections";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";

const PAGE_SIZE = 10;

export function SectionsPage() {
  const { warehouseId = "" } = useParams<{ warehouseId: string }>();
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<SectionFilters>(
    EMPTY_SECTION_FILTERS,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { GetSections } = useWarehouseAdmin({
    getSectionsPayload: {
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
    },
  });

  const sectionsData = useMemo(
    () => filterSections(GetSections.data ?? [], appliedFilters),
    [GetSections.data, appliedFilters],
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sectionsData.slice(start, start + PAGE_SIZE);
  }, [sectionsData, currentPage]);

  useEffect(() => {
    if (!GetSections.isError || !GetSections.error) return;
    const mappedError = getMappedError(GetSections.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [
    GetSections.isError,
    GetSections.error,
    getMappedError,
    handleRequestError,
  ]);

  const handleApplyFilters = useCallback((filters: SectionFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_SECTION_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleViewLots = useCallback(
    (section: SectionResponse) => {
      navigate(
        `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/lots/${section.section_id}`,
      );
    },
    [baseUrl, navigate, warehouseId],
  );

  const handleViewRacks = useCallback(
    (section: SectionResponse) => {
      navigate(
        `${baseUrl}/warehouse-admin/management/sections/${warehouseId}/racks/${section.section_id}`,
      );
    },
    [baseUrl, navigate, warehouseId],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {GetSections.isPending && <Loader title="Cargando secciones..." />}

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>

      <SectionsHeader warehouseId={warehouseId} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre una nueva sección
            </small>
          </div>
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          <Button
            type="button"
            size="giant"
            label="Registrar Nueva Sección"
            icon={<LayoutGrid size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => setIsSectionModalOpen(true)}
          />
        </div>
      </div>

      <SectionsFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <SectionsTable
        data={paginatedData}
        currentPage={currentPage}
        totalRecords={sectionsData.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewLots={handleViewLots}
        onViewRacks={handleViewRacks}
        isFetching={GetSections.isFetching}
      />

      <SectionModal
        isOpen={isSectionModalOpen}
        warehouseId={warehouseId}
        onClose={() => setIsSectionModalOpen(false)}
      />
    </m.div>
  );
}
