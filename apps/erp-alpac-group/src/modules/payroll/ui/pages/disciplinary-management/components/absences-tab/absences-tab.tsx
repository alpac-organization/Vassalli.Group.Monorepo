import { Pagination } from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetAbsencesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/get-absences.request";
import type { AbsenceDto } from "@app/modules/payroll/domain/ApiContract/Responses/absence-responses/get-absences.response";
import type {
  AbsenceSourceEnumMap,
  AbsenceStatusEnumMap,
} from "@app/modules/payroll/domain/enums/absence-enums/absence.enum";
import { useAbsence } from "@app/modules/payroll/ui/hooks/absence/useAbsence";
import { AbsenceDetailsModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/absence-details-modal/absence-details-modal";
import { AbsencesFilters } from "@app/modules/payroll/ui/pages/disciplinary-management/components/absences-filters/absences-filters";
import type { AbsencesFilterFormValues } from "@app/modules/payroll/ui/pages/disciplinary-management/components/absences-filters/absences-filters.types";
import { AbsencesTable } from "@app/modules/payroll/ui/pages/disciplinary-management/components/absences-table/absences-table";
import { RegisterAbsenceModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-absence-modal/register-absence-modal";
import {
  disciplinaryApproveButtonClassName,
  disciplinaryRejectButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCallback, useMemo, useState } from "react";

const PAGE_SIZE = 10;

type AbsencesTabProps = {
  canWrite?: boolean;
};

export const AbsencesTab = ({ canWrite = true }: AbsencesTabProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestSuccess, handleRequestError } =
    useAlertState();

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<AbsencesFilterFormValues>({
    identification_number: "",
    status: "all",
    source: "all",
    start_date: "",
    end_date: "",
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<AbsenceDto | null>(null);

  const absencesFilters = useMemo<GetAbsencesRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      ...(appliedFilters.identification_number.trim() && {
        identification_number: appliedFilters.identification_number.trim(),
      }),
      ...(appliedFilters.status !== "all" && {
        status: appliedFilters.status as AbsenceStatusEnumMap,
      }),
      ...(appliedFilters.source !== "all" && {
        source: appliedFilters.source as AbsenceSourceEnumMap,
      }),
      ...(appliedFilters.start_date && {
        start_date: appliedFilters.start_date,
      }),
      ...(appliedFilters.end_date && {
        end_date: appliedFilters.end_date,
      }),
    }),
    [companyId, moduleCode, pageNumber, appliedFilters],
  );

  const absenceDetailFilters = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      absence_id: selectedAbsence?.absence_id ?? "",
    }),
    [companyId, moduleCode, selectedAbsence?.absence_id],
  );

  const {
    GetAbsences,
    GetAbsenceDetails,
    ApplyAbsence,
    CancelAbsence,
    DeleteAbsence,
  } = useAbsence({
    absencesFilters,
    absenceDetailFilters: isDetailOpen ? absenceDetailFilters : undefined,
  });

  const handleApplyFilters = useCallback((values: AbsencesFilterFormValues) => {
    setAppliedFilters(values);
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters({
      identification_number: "",
      status: "all",
      source: "all",
      start_date: "",
      end_date: "",
    });
    setPageNumber(1);
  }, []);

  const handleViewDetail = useCallback((row: AbsenceDto) => {
    setSelectedAbsence(row);
    setIsDetailOpen(true);
  }, []);

  const handleOpenApply = useCallback((row: AbsenceDto) => {
    setSelectedAbsence(row);
    setIsApplyModalOpen(true);
  }, []);

  const handleOpenCancel = useCallback((row: AbsenceDto) => {
    setSelectedAbsence(row);
    setIsCancelModalOpen(true);
  }, []);

  const handleOpenDelete = useCallback((row: AbsenceDto) => {
    setSelectedAbsence(row);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmApply = async () => {
    if (!selectedAbsence) return;

    try {
      await ApplyAbsence.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        absence_id: selectedAbsence.absence_id,
      });
      handleRequestSuccess("Inasistencia aplicada exitosamente");
      setIsApplyModalOpen(false);
      setIsDetailOpen(false);
      setSelectedAbsence(null);
    } catch (error) {
      const mapped = getMappedError(error as ApiErrorResponse);
      handleRequestError(
        mapped.description || "No se pudo aplicar la inasistencia.",
      );
    }
  };

  const handleConfirmCancel = async (_type: unknown, observation?: string) => {
    if (!selectedAbsence || !observation?.trim()) return;

    try {
      await CancelAbsence.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        absence_id: selectedAbsence.absence_id,
        cancellation_reason: observation.trim(),
      });
      handleRequestSuccess("Inasistencia cancelada exitosamente");
      setIsCancelModalOpen(false);
      setIsDetailOpen(false);
      setSelectedAbsence(null);
    } catch (error) {
      const mapped = getMappedError(error as ApiErrorResponse);
      handleRequestError(
        mapped.description || "No se pudo cancelar la inasistencia.",
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAbsence) return;

    try {
      await DeleteAbsence.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        absence_id: selectedAbsence.absence_id,
      });
      handleRequestSuccess("Inasistencia anulada correctamente");
      setIsDeleteModalOpen(false);
      setIsDetailOpen(false);
      setSelectedAbsence(null);
    } catch (error) {
      const mapped = getMappedError(error as ApiErrorResponse);
      handleRequestError(
        mapped.description || "No se pudo anular la inasistencia.",
      );
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {(GetAbsences.isLoading || GetAbsences.isFetching) && (
        <Loader title="Cargando ausencias..." />
      )}

      {AlertComponent}

      <AbsencesFilters
        canWrite={canWrite}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onRegisterAbsence={() => setIsRegisterOpen(true)}
      />

      <AbsencesTable
        data={GetAbsences.data?.data ?? [] } 
        onViewDetail={handleViewDetail}
        onApply={handleOpenApply}
        onCancel={handleOpenCancel}
        onDelete={handleOpenDelete}
        canWrite={canWrite}
        pagination={
          <Pagination
            currentPage={GetAbsences.data?.page_number ?? pageNumber}
            pageSize={GetAbsences.data?.page_size ?? PAGE_SIZE}
            totalRecords={GetAbsences.data?.total ?? 0}
            onPageChange={handlePageChange}
            disabled={GetAbsences.isFetching}
          />
        }
      />

      <RegisterAbsenceModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <AbsenceDetailsModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedAbsence(null);
        }}
        summary={selectedAbsence}
        detail={GetAbsenceDetails.data}
        isDetailLoading={
          GetAbsenceDetails.isLoading || GetAbsenceDetails.isFetching
        }
        canWrite={canWrite}
        onApply={() => {
          setIsDetailOpen(false);
          setIsApplyModalOpen(true);
        }}
        onCancel={() => {
          setIsDetailOpen(false);
          setIsCancelModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <ConfirmModal
        isOpen={isApplyModalOpen}
        title="¿Desea aplicar esta inasistencia?"
        type="APPROVE"
        buttonActionLabel="Aplicar inasistencia"
        buttonActionClass={disciplinaryApproveButtonClassName}
        buttonCancelClass="rounded-md! h-11 px-6! border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        isLoading={ApplyAbsence.isPending}
        onClose={() => setIsApplyModalOpen(false)}
        handleFinalAction={handleConfirmApply}
      >
      </ConfirmModal>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancelar inasistencia"
        type="CANCEL"
        hasObservation={true}
        observationLabel="Motivo de cancelación"
        isObservationRequired={true}
        buttonActionLabel="Confirmar cancelación"
        buttonActionClass={disciplinaryRejectButtonClassName}
        buttonCancelClass="rounded-md! h-11 px-6! border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        isLoading={CancelAbsence.isPending}
        onClose={() => setIsCancelModalOpen(false)}
        handleFinalAction={handleConfirmCancel}
      >
      </ConfirmModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="¿Está seguro de anular esta inasistencia?"
        type="DELETE"
        buttonActionLabel="Anular inasistencia"
        buttonActionClass={disciplinaryRejectButtonClassName}
        isLoading={DeleteAbsence.isPending}
        disabled={DeleteAbsence.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        handleFinalAction={handleConfirmDelete}
      >
      </ConfirmModal>
    </div>
  );
};
