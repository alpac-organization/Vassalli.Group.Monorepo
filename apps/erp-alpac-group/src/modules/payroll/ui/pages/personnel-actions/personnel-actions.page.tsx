import { Banner, Breadcrumb, Pagination } from "@alpac/design-system";
import { RoleEnum } from "@app/core/enums/role.enum";
import type { GetPersonnelActionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/get-personnel-actions.request";
import type { PersonnelActionRequestDto } from "@app/modules/payroll/domain/ApiContract/Responses/personnel-action-responses/get-personnel-actions.response";
import { usePersonnelAction } from "@app/modules/payroll/ui/hooks/personnel-action/usePersonnelAction";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useModulePageHeader } from "@app/shared/hooks/useModulePageHeader";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { ApplyPersonnelActionModal } from "./components/apply-personnel-action-modal/apply-personnel-action-modal";
import { CreatePersonnelActionModal } from "./components/create-personnel-action-modal/create-personnel-action-modal";
import { PersonnelActionDetailModal } from "./components/personnel-action-detail-modal/personnel-action-detail-modal";
import { PersonnelActionsFilters } from "./components/personnel-actions-filters/personnel-actions-filters";
import type { PersonnelActionsFilterValues } from "./components/personnel-actions-filters/personnel-actions-filters.types";
import { PersonnelActionsHeader } from "./components/personnel-actions-header/personnel-actions-header";
import { PersonnelActionsTable } from "./components/personnel-actions-table/personnel-actions-table";
import { ReviewPersonnelActionModal } from "./components/review-personnel-action-modal/review-personnel-action-modal";

const PAGE_SIZE = 10;

const EMPTY_FILTERS: PersonnelActionsFilterValues = {
  status: "all",
  scope: "all",
  start_date: null,
  end_date: null,
};

export const PersonnelActionsPage = () => {
  const { role, companyId, moduleCode } = useUserStore();
  const { AlertComponent, handleRequestSuccess } = useAlertState();
  const { activeLogo, breadcrumbItems } = useModulePageHeader((baseUrl) => [
    { label: "Dashboard", url: `${baseUrl}/` },
    { label: "Solicitudes del Personal", url: `${baseUrl}/payroll/personnel-actions` },
  ]);

  const canReview = role === RoleEnum.ADMINISTRATOR || role === RoleEnum.MANAGER;
  const canCreate =
    role === RoleEnum.ADMINISTRATOR ||
    role === RoleEnum.MANAGER ||
    role === RoleEnum.OPERATOR;
  const canApply =
    role === RoleEnum.ADMINISTRATOR ||
    role === RoleEnum.MANAGER ||
    role === RoleEnum.OPERATOR;

  const [pageNumber, setPageNumber] = useState(1);
  const [filterValues, setFilterValues] =
    useState<PersonnelActionsFilterValues>(EMPTY_FILTERS);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailRequestId, setDetailRequestId] = useState<string | null>(null);
  const [reviewRequest, setReviewRequest] = useState<PersonnelActionRequestDto | null>(null);
  const [applyRequest, setApplyRequest] = useState<PersonnelActionRequestDto | null>(null);

  const queryPayload: GetPersonnelActionsRequest = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      ...(filterValues.status !== "all" && {
        status: parseInt(filterValues.status, 10),
      }),
      ...(filterValues.scope !== "all" && {
        scope: parseInt(filterValues.scope, 10),
      }),
      ...(filterValues.start_date && { start_date: filterValues.start_date }),
      ...(filterValues.end_date && { end_date: filterValues.end_date }),
    }),
    [companyId, moduleCode, pageNumber, filterValues],
  );

  const { GetPersonnelActions } = usePersonnelAction({
    requestsFilters: queryPayload,
  });
  const { getMappedError } = useMappedError();
  const listErrorDescription =
    GetPersonnelActions.isError && GetPersonnelActions.error
      ? getMappedError(GetPersonnelActions.error).description
      : null;

  const handleApplyFilters = useCallback((values: PersonnelActionsFilterValues) => {
    setFilterValues(values);
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilterValues(EMPTY_FILTERS);
    setPageNumber(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPageNumber(newPage);
  }, []);

  const handleViewDetail = useCallback((request: PersonnelActionRequestDto) => {
    setDetailRequestId(request.id);
  }, []);

  const handleReview = useCallback((request: PersonnelActionRequestDto) => {
    setReviewRequest(request);
  }, []);

  const handleApply = useCallback((request: PersonnelActionRequestDto) => {
    setApplyRequest(request);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      {(GetPersonnelActions.isLoading || GetPersonnelActions.isFetching) && (
        <Loader title="Cargando acciones de personal..." />
      )}

      {AlertComponent}

      <div className="flex justify-start">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <PersonnelActionsHeader
        canCreate={canCreate}
        activeLogo={activeLogo}
        onNewRequest={() => setIsCreateOpen(true)}
      />

      <PersonnelActionsFilters
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        isLoading={GetPersonnelActions.isFetching}
      />

      {listErrorDescription && !GetPersonnelActions.data ? (
        <Banner
          variant="error"
          title="Error al cargar las acciones de personal"
          description={listErrorDescription}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {listErrorDescription && (
            <Banner
              variant="error"
              title="Error al actualizar las acciones de personal"
              description={listErrorDescription}
            />
          )}
          <PersonnelActionsTable
            data={GetPersonnelActions.data?.data ?? []}
            isLoading={GetPersonnelActions.isLoading}
            canReview={canReview}
            canApply={canApply}
            onViewDetail={handleViewDetail}
            onReview={handleReview}
            onApply={handleApply}
            pagination={
              <Pagination
                currentPage={GetPersonnelActions.data?.page_number ?? pageNumber}
                pageSize={GetPersonnelActions.data?.page_size ?? PAGE_SIZE}
                totalRecords={GetPersonnelActions.data?.total ?? 0}
                onPageChange={handlePageChange}
                disabled={GetPersonnelActions.isFetching}
              />
            }
          />
        </div>
      )}

      {/* Modal Creación */}
      <CreatePersonnelActionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleRequestSuccess}
      />

      {/* Modal Detalle */}
      <PersonnelActionDetailModal
        isOpen={Boolean(detailRequestId)}
        onClose={() => setDetailRequestId(null)}
        requestId={detailRequestId}
      />

      {/* Modal Revisión */}
      <ReviewPersonnelActionModal
        isOpen={Boolean(reviewRequest)}
        onClose={() => setReviewRequest(null)}
        onSuccess={handleRequestSuccess}
        request={reviewRequest}
      />

      {/* Modal Aplicación */}
      <ApplyPersonnelActionModal
        isOpen={Boolean(applyRequest)}
        onClose={() => setApplyRequest(null)}
        onSuccess={handleRequestSuccess}
        request={applyRequest}
      />
    </m.div>
  );
};
