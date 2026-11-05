import { Pagination } from "@alpac/design-system";
import { RoleEnum } from "@app/core/enums/role.enum";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetSanctionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanctions.request";
import type { ProcessSanctionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/process-sanction.request";
import type { SanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";
import type { SanctionStatusEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import type { SanctionTypeEnumMap } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";
import { useSanction } from "@app/modules/payroll/ui/hooks/sanction/useSanction";
import { SanctionDetailsModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanction-details-modal/sanction-details-modal";
import { SanctionsFilters } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-filters/sanctions-filters";
import type { SanctionsFilterFormValues } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-filters/sanctions-filters.types";
import { SanctionsTable } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-table/sanctions-table";
import {
  cancelConfirmActionClass,
  cancelConfirmExitClass,
  disciplinaryApproveButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-managment.variants";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCallback, useMemo, useState } from "react";

const PAGE_SIZE = 10;

type ProcessConfirmState = {
  isOpen: boolean;
  type: ConfirmActionType;
  sanction: SanctionDto | null;
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
    useState<SanctionsFilterFormValues>({
      code: "",
      sanction_type: "all",
      sanction_status: "all",
    });

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSanction, setSelectedSanction] = useState<SanctionDto | null>(
    null,
  );
  const [processConfirm, setProcessConfirm] = useState<ProcessConfirmState>({
    isOpen: false,
    type: "APPROVE",
    sanction: null,
  });

  const sanctionsFilters = useMemo<GetSanctionsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      ...(appliedFilters.code.trim() && { code: appliedFilters.code.trim() }),
      ...(appliedFilters.sanction_type !== "all" && {
        sanction_type: appliedFilters.sanction_type as SanctionTypeEnumMap,
      }),
      ...(appliedFilters.sanction_status !== "all" && {
        sanction_status:
          appliedFilters.sanction_status as SanctionStatusEnumMap,
      }),
    }),
    [companyId, moduleCode, pageNumber, appliedFilters],
  );

  const sanctionDetailFilters = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      sanction_id: selectedSanction?.sanction_id ?? "",
    }),
    [companyId, moduleCode, selectedSanction?.sanction_id],
  );

  const { GetSanctions, GetSanctionDetails, ProcessSanction } = useSanction({
    sanctionsFilters,
    sanctionDetailFilters: isDetailOpen ? sanctionDetailFilters : undefined,
  });

  const handleApplyFilters = useCallback(
    (values: SanctionsFilterFormValues) => {
      setAppliedFilters(values);
      setPageNumber(1);
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setAppliedFilters({
      code: "",
      sanction_type: "all",
      sanction_status: "all",
    });
    setPageNumber(1);
  }, []);

  const handleViewDetail = useCallback((row: SanctionDto) => {
    setSelectedSanction(row);
    setIsDetailOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const openProcessConfirm = useCallback(
    (row: SanctionDto, type: ConfirmActionType) => {
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

      const payload: ProcessSanctionRequest = {
        company_id: companyId,
        module_code: moduleCode,
        sanction_id: sanction.sanction_id,
        is_approved: isApproved,
        ...(!isApproved && {
          cancellation_reason: observation?.trim() ?? "",
        }),
      };

      try {
        await ProcessSanction.mutateAsync(payload);
        closeProcessConfirm();
        setIsDetailOpen(false);
        setSelectedSanction(null);
        handleRequestSuccess(
          isApproved
            ? "Sanción aplicada exitosamente"
            : "Sanción anulada exitosamente",
        );
      } catch (error) {
        closeProcessConfirm();
        const mapped = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mapped.description ||
            (isApproved
              ? "No se pudo aplicar la sanción. Intente de nuevo."
              : "No se pudo anular la sanción. Intente de nuevo."),
        );
      }
    },
    [
      ProcessSanction,
      closeProcessConfirm,
      companyId,
      getMappedError,
      handleRequestError,
      handleRequestSuccess,
      moduleCode,
      processConfirm.sanction,
      processConfirm.type,
    ],
  );

  const isApproveConfirm = processConfirm.type === "APPROVE";

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
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSanction(null);
        }}
        summary={selectedSanction}
        detail={GetSanctionDetails.data}
        isDetailLoading={
          GetSanctionDetails.isLoading || GetSanctionDetails.isFetching
        }
      />

      <ConfirmModal
        variant="warning"
        title={
          isApproveConfirm
            ? "¿Está seguro de aplicar esta sanción disciplinaria?"
            : "¿Está seguro de anular esta sanción disciplinaria?"
        }
        buttonActionLabel={isApproveConfirm ? "Aplicar sanción" : "Anular sanción"}
        buttonActionClass={
          isApproveConfirm
            ? disciplinaryApproveButtonClassName
            : cancelConfirmActionClass
        }
        buttonCancelClass={cancelConfirmExitClass}
        isOpen={processConfirm.isOpen}
        onClose={closeProcessConfirm}
        type={processConfirm.type}
        hasObservation={!isApproveConfirm}
        observationLabel="motivo de anulación"
        isObservationRequired={!isApproveConfirm}
        isLoading={ProcessSanction.isPending}
        disabled={ProcessSanction.isPending}
        handleFinalAction={(type, observation) => {
          void handleConfirmProcess(type, observation);
        }}
      />

      {AlertComponent}
    </div>
  );
};
