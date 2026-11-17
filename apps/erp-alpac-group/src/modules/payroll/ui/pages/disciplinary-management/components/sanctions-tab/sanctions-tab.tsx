import { useCallback, useMemo, useState } from "react";
import { Pagination } from "@alpac/design-system";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import { usePayrollStatus } from "@app/modules/payroll/ui/hooks/payroll/usePayroll";
import { useSanction } from "@app/modules/payroll/ui/hooks/sanction/useSanction";
import { SanctionDetailsModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanction-details-modal/sanction-details-modal";
import { SanctionsFilters } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-filters/sanctions-filters";
import { SanctionsTable } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-table/sanctions-table";
import {
  cancelConfirmActionClass,
  cancelConfirmExitClass,
  disciplinaryApproveButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-managment.variants";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";

import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetSanctionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanctions.request";
import type { ProcessSanctionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/process-sanction.request";
import type { SanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";
import type { SanctionStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import type { SanctionTypeEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import type { SanctionsFilterFormValues } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-filters/sanctions-filters.types";
import type { ProcessSanctionAction, ProcessSanctionConfirmCopy, ProcessSanctionConfirmState } from "./sanction-tab.types";

const PAGE_SIZE = 10;

const EMPTY_FILTERS: SanctionsFilterFormValues = {
  code: "",
  sanction_type: "all",
  sanction_status: "all",
};

const PROCESS_CONFIRM_COPY: Record<ProcessSanctionAction, ProcessSanctionConfirmCopy> =
{
  APPROVE: {
    variant: "warning",
    title: "¿Está seguro de aplicar esta sanción disciplinaria?",
    suspensionTitle: "¿Aplicar suspensión? Se vinculará a la nómina en progreso del colaborador.",
    actionLabel: "Aplicar sanción",
    actionClass: disciplinaryApproveButtonClassName,
    successMessage: "Sanción aplicada exitosamente",
    fallbackError: "No se pudo aplicar la sanción. Intente de nuevo.",
  },
  REJECT: {
    variant: "warning",
    title: "¿Está seguro de anular esta sanción disciplinaria?",
    suspensionTitle: "¿Está seguro de anular esta sanción disciplinaria?",
    actionLabel: "Anular sanción",
    actionClass: cancelConfirmActionClass,
    successMessage: "Sanción anulada exitosamente",
    fallbackError: "No se pudo anular la sanción. Intente de nuevo.",
  },
};

export const SanctionsTab = () => {
  const { companyId, moduleCode, role } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestSuccess, handleRequestError } =
    useAlertState();

  const canApprove = role === RoleEnum.ADMINISTRATOR;
  const canReject =
    role === RoleEnum.ADMINISTRATOR || role === RoleEnum.MANAGER;

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] =
    useState<SanctionsFilterFormValues>(EMPTY_FILTERS);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSanction, setSelectedSanction] = useState<SanctionDto | null>(
    null,
  );
  const [processConfirm, setProcessConfirm] = useState<ProcessSanctionConfirmState>({
    isOpen: false,
    type: "APPROVE",
    sanction: null,
  });

  const isApproveConfirm = processConfirm.type === "APPROVE";
  const isApprovingSuspension =
    processConfirm.isOpen &&
    isApproveConfirm &&
    processConfirm.sanction?.sanction_type === "Suspension";

  const processCopy = PROCESS_CONFIRM_COPY[processConfirm.type];

  const sanctionsFilters = useMemo<GetSanctionsRequest>(() => {
    const filters: GetSanctionsRequest = {
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
    };

    const code = appliedFilters.code.trim();
    if (code) {
      filters.code = code;
    }
    if (appliedFilters.sanction_type !== "all") {
      filters.sanction_type = appliedFilters.sanction_type as SanctionTypeEnumMap;
    }
    if (appliedFilters.sanction_status !== "all") {
      filters.sanction_status = appliedFilters.sanction_status as SanctionStatusEnumMap;
    }

    return filters;
  }, [companyId, moduleCode, pageNumber, appliedFilters]);

  const detailSanctionId = useMemo(() => {
    if (isDetailOpen && selectedSanction?.sanction_id) {
      return selectedSanction.sanction_id;
    }
    if (isApprovingSuspension && processConfirm.sanction?.sanction_id) {
      return processConfirm.sanction.sanction_id;
    }
    return "";
  }, [
    isApprovingSuspension,
    isDetailOpen,
    processConfirm.sanction?.sanction_id,
    selectedSanction?.sanction_id,
  ]);

  const sanctionDetailFilters = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      sanction_id: detailSanctionId,
    }),
    [companyId, moduleCode, detailSanctionId],
  );

  const { GetSanctions, GetSanctionDetails, ProcessSanction } = useSanction({
    sanctionsFilters,
    sanctionDetailFilters: detailSanctionId
      ? sanctionDetailFilters
      : undefined,
  });

  const processIdentification =
    GetSanctionDetails.data?.identification_number?.trim() ?? "";

  const collaboratorDetailsPayload = useMemo(() => {
    if (!isApprovingSuspension || !processIdentification) {
      return;
    }

    return {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: processIdentification,
    };
  }, [
    companyId,
    isApprovingSuspension,
    moduleCode,
    processIdentification,
  ]);

  const { GetProfileDetails } = useCollaborators({
    CollaboratorDetailsPayload: collaboratorDetailsPayload,
  });

  const branchId =
    GetProfileDetails.data?.working_information?.branch_id?.trim() ?? "";
  const payrollType =
    GetProfileDetails.data?.working_information?.payroll_type;

  const payrollStatusQuery = usePayrollStatus({
    payload: {
      companie_id: companyId ?? "",
      module_code: moduleCode ?? "",
      branch_id: branchId,
      payrol_type: payrollType ?? "None",
    },
    enabled: Boolean(
      isApprovingSuspension && companyId && moduleCode && branchId && payrollType,
    ),
  });

  const payrollIdInProgress = useMemo(() => {
    if (!payrollStatusQuery.isSuccess) return;
    if (!payrollStatusQuery.data?.exist_payroll_in_progress) return;

    const payrollId = payrollStatusQuery.data.payroll_id?.trim();
    if (!payrollId) return;

    return payrollId;
  }, [payrollStatusQuery.isSuccess, payrollStatusQuery.data]);

  const isResolvingPayroll = isApprovingSuspension && (GetSanctionDetails.isLoading ||
    GetSanctionDetails.isFetching ||
    GetProfileDetails.isLoading ||
    GetProfileDetails.isFetching ||
    payrollStatusQuery.isLoading ||
    payrollStatusQuery.isFetching);  

  const handleApplyFilters = useCallback(
    (values: SanctionsFilterFormValues) => {
      setAppliedFilters(values);
      setPageNumber(1);
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_FILTERS);
    setPageNumber(1);
  }, []);

  const handleViewDetail = useCallback((row: SanctionDto) => {
    setSelectedSanction(row);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedSanction(null);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const openProcessConfirm = useCallback(
    (row: SanctionDto, type: ProcessSanctionAction) => {
      if (row.sanction_status !== "Pending") {
        handleRequestError(
          "Solo se pueden procesar sanciones pendientes de aprobación.",
        );
        return;
      }

      setProcessConfirm({ isOpen: true, type, sanction: row });
    },
    [handleRequestError],
  );

  const closeProcessConfirm = useCallback(() => {
    setProcessConfirm({ isOpen: false, type: "APPROVE", sanction: null });
  }, []);

  const handleConfirmProcess = useCallback(
    async (_type: ConfirmActionType, observation?: string) => {
      const sanction = processConfirm.sanction;
      if (!sanction?.sanction_id) return;

      const isApproved = processConfirm.type === "APPROVE";
      const isSuspension = sanction.sanction_type === "Suspension";
      const copy = PROCESS_CONFIRM_COPY[processConfirm.type];

      if (isApproved && isSuspension) {
        if (isResolvingPayroll) {
          handleRequestError(
            "Espere a que se resuelva la nómina en progreso del colaborador.",
          );
          return;
        }
        if (!payrollIdInProgress) {
          handleRequestError(
            "No hay una nómina ordinaria en progreso para aplicar la suspensión.",
          );
          return;
        }
      }

      const payload: ProcessSanctionRequest = {
        company_id: companyId,
        module_code: moduleCode,
        sanction_id: sanction.sanction_id,
        is_approved: isApproved,
      };

      if (!isApproved) {
        payload.cancellation_reason = observation?.trim() ?? "";
      }

      if (isApproved && isSuspension && payrollIdInProgress) {
        payload.payroll_id = payrollIdInProgress;
      }

      try {
        await ProcessSanction.mutateAsync(payload);
        closeProcessConfirm();
        handleCloseDetail();
        handleRequestSuccess(copy.successMessage);
      } catch (error) {
        closeProcessConfirm();
        const mapped = getMappedError(error as ApiErrorResponse);
        handleRequestError(mapped.description || copy.fallbackError);
      }
    },
    [
      ProcessSanction,
      closeProcessConfirm,
      companyId,
      getMappedError,
      handleCloseDetail,
      handleRequestError,
      handleRequestSuccess,
      isResolvingPayroll,
      moduleCode,
      payrollIdInProgress,
      processConfirm.sanction,
      processConfirm.type,
    ],
  );

  const confirmTitle =
    isApprovingSuspension ? processCopy.suspensionTitle : processCopy.title;

  const isConfirmDisabled =
    ProcessSanction.isPending ||
    (isApprovingSuspension && (isResolvingPayroll || !payrollIdInProgress));

  return (
    <div className="flex flex-col gap-4">
      {(GetSanctions.isLoading || GetSanctions.isFetching) && (
        <Loader title="Cargando sanciones disciplinarias..." />
      )}

      <SanctionsFilters
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <SanctionsTable
        data={GetSanctions.data?.data ?? []}
        onViewDetail={handleViewDetail}
        onApprove={(row) => openProcessConfirm(row, "APPROVE")}
        onReject={(row) => openProcessConfirm(row, "REJECT")}
        canApprove={canApprove}
        canReject={canReject}
        pagination={
          <Pagination
            currentPage={GetSanctions.data?.page_number ?? pageNumber}
            pageSize={GetSanctions.data?.page_size ?? PAGE_SIZE}
            totalRecords={GetSanctions.data?.total ?? 0}
            onPageChange={handlePageChange}
            disabled={GetSanctions.isFetching}
          />
        }
      />

      <SanctionDetailsModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        summary={selectedSanction}
        detail={GetSanctionDetails.data}
        isDetailLoading={
          GetSanctionDetails.isLoading || GetSanctionDetails.isFetching
        }
      />

      <ConfirmModal
        variant={processCopy.variant}
        title={confirmTitle}
        buttonActionLabel={processCopy.actionLabel}
        buttonActionClass={processCopy.actionClass}
        buttonCancelClass={cancelConfirmExitClass}
        isOpen={processConfirm.isOpen}
        onClose={closeProcessConfirm}
        type={processConfirm.type}
        hasObservation={!isApproveConfirm}
        observationLabel="motivo de anulación"
        isObservationRequired={!isApproveConfirm}
        isLoading={ProcessSanction.isPending || isResolvingPayroll}
        disabled={isConfirmDisabled}
        handleFinalAction={(type, observation) => {
          void handleConfirmProcess(type, observation);
        }}
      />

      {AlertComponent}
    </div>
  );
};
