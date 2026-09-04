import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { Loader } from "@app/shared/components/loaders/loader";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useWarehouseAssignment";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import { AssignmentHeader } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-header/assignment-header";
import { AssignmentFiltersBar } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-filters/assignment-filters";
import { AssignmentTable } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-table/assignment-table";
import { AssignmentHistoryTable } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-history-table/assignment-history-table";
import { AssignmentModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-modal/assignment-modal";
import { AssignmentDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-detail-modal/assignment-detail-modal";
import type {
  AssignmentFilters,
  AssignmentPageView,
  SelectedAssignmentTarget,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment.types";
import type { GetPendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { GetAssignmentsHistoryRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignments-history";
import type { GetAssignmentDetailRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/get-assignment-detail";

const PAGE_SIZE = 10;
const EMPTY_FILTERS: AssignmentFilters = {
  driver_name: "",
  license_plate: "",
  document_type: "",
  service_order_code: "",
};

export function WarehouseAssignmentPage() {
  const { companyId, moduleCode, areaId, branchId } = useUserStore();
  const { AlertComponent, handleRequestError, handleRequestSuccess } =
    useAlertState();

  const [activeView, setActiveView] = useState<AssignmentPageView>("pending");
  const [pageNumber, setPageNumber] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<AssignmentFilters>(EMPTY_FILTERS);

  const [assignTarget, setAssignTarget] = useState<SelectedAssignmentTarget | null>(null);
  const [detailTarget, setDetailTarget] = useState<SelectedAssignmentTarget | null>(null);

  const collaboratorsPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      area_id: areaId,
      branch_id: branchId,
      page_size: 10,
      page_number: 1,
      status: "Active",
    }),
    [companyId, moduleCode, areaId, branchId],
  );

  const { GetCollaboratorsQuery } = useCollaborators({
    Collaboratorsfilters: collaboratorsPayload,
  });

  const collaboratorsOptions = useMemo(
    () =>
      (GetCollaboratorsQuery.data?.data ?? []).map((c) => ({
        value: c.collaborator_id,
        label: c.full_name,
      })),
    [GetCollaboratorsQuery.data],
  );

  const payloadPending = useMemo<GetPendingAssignmentsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      driver_name: appliedFilters.driver_name.trim() || undefined,
      license_plate: appliedFilters.license_plate.trim() || undefined,
      service_order_code: appliedFilters.service_order_code?.trim() || undefined,
      document_type: appliedFilters.document_type || undefined,
    }),
    [companyId, moduleCode, pageNumber, appliedFilters],
  );

  const payloadHistory = useMemo<GetAssignmentsHistoryRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: historyPage,
      page_size: PAGE_SIZE,
      driver_name: appliedFilters.driver_name.trim() ,
      license_plate: appliedFilters.license_plate.trim() ,
      service_order_code: appliedFilters.service_order_code?.trim(),
      document_type: appliedFilters.document_type ,
    }),
    [companyId, moduleCode, historyPage, appliedFilters],
  );

  const payloadDetail = useMemo<GetAssignmentDetailRequest | null>(
    () =>
      detailTarget
        ? {
            company_id: companyId,
            module_code: moduleCode,
            reception_id: detailTarget.reception_id,
            entrance_ducat_id: detailTarget.entrance_ducat_id ?? undefined,
          }
        : null,
    [companyId, moduleCode, detailTarget],
  );

  const { GetPendingAssignments, GetAssignmentsHistory, GetAssignmentDetail } =
    useWarehouseAssignment({
      payloadPending,
      payloadHistory: activeView === "history" ? payloadHistory : undefined,
      payloadDetail: payloadDetail ?? undefined,
    });

  const { data: pendingData, isLoading, isFetching } = GetPendingAssignments;

  

  
  const { data: historyData, isFetching: isHistoryFetching } = GetAssignmentsHistory;
  const { data: detail, isLoading: isDetailLoading } = GetAssignmentDetail;

  const handleApplyFilters = useCallback((filters: AssignmentFilters) => {
    setAppliedFilters(filters);
    setPageNumber(1);
    setHistoryPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_FILTERS);
    setPageNumber(1);
    setHistoryPage(1);
  }, []);

  const handleAssignClick = useCallback((target: SelectedAssignmentTarget) => {
    setAssignTarget(target);
  }, []);

  const handleDetailClick = useCallback((target: SelectedAssignmentTarget) => {
    setDetailTarget(target);
  }, []);

  const handleAssignSuccess = useCallback(() => {
    handleRequestSuccess("Asignación completada exitosamente");
    setPageNumber(1);
  }, [handleRequestSuccess]);

  const handleAssignError = useCallback(
    (msg: string) => {
      handleRequestError(msg);
    },
    [handleRequestError],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {isLoading && <Loader title="Cargando asignaciones..." />}

      <AssignmentHeader activeView={activeView} onViewChange={setActiveView} />

      <AssignmentFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {activeView === "pending" && (
        <AssignmentTable
          view="pending"
          data={pendingData?.data ?? []}
          currentPage={pendingData?.page_number ?? pageNumber}
          totalRecords={pendingData?.total ?? 0}
          pageSize={pendingData?.page_size ?? PAGE_SIZE}
          isFetching={isFetching}
          onPageChange={setPageNumber}
          onAssignClick={handleAssignClick}
          onDetailClick={handleDetailClick}
        />
      )}

      {activeView === "history" && (
        <AssignmentHistoryTable
          data={historyData?.data ?? []}
          currentPage={historyData?.page_number ?? historyPage}
          totalRecords={historyData?.total ?? 0}
          pageSize={historyData?.page_size ?? PAGE_SIZE}
          isFetching={isHistoryFetching}
          onPageChange={setHistoryPage}
          onDetailClick={handleDetailClick}
        />
      )}

      {/* Modal wizard de asignación */}
      <AssignmentModal
        isOpen={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        target={assignTarget}
        companyId={companyId}
        moduleCode={moduleCode}
        collaboratorsOptions={collaboratorsOptions}
        onSuccess={handleAssignSuccess}
        onError={handleAssignError}
      />

      {/* Modal de detalle (solo lectura) */}
      <AssignmentDetailModal
        isOpen={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        detail={detail}
        isLoading={isDetailLoading}
      />

      {AlertComponent}
    </m.div>
  );
}



