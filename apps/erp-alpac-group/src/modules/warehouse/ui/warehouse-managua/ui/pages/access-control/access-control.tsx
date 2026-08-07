import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Alert, AnimatedAlertWrapper } from "@alpac/design-system";
import { AccessControlHeader } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-header/access-control-header";
import { AccessControlStats } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-stats/access-control-stats";
import { AccessControlActions } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-actions/access-control-actions";
import { AccessControlFiltersBar } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/access-control-filters";
import { MovementsQueue } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/movements-queue";
import { MovementDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/movement-detail-modal";
import { GateEntryModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/gate-entry-modal";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { MovementDetailFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/types/movement-detail.types";
import { getAccessControlMetrics } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/filter-movements";
import {
  toApiDate,
  mapGateEntryToCreateRequest,
  type EntryStartedAt,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/mapping-access-control";
import { useAccessControl } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAccessControl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type { UpdateReceptionEntranceRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/update-access-control";
import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { DocumentType } from "@app/core/enums/document.enum";
import type { Path } from "react-hook-form";

const PAGE_SIZE = 10;
const EMPTY_FILTERS: AccessControlFilters = {
  ducat_number: "",
  document_number: "",
  document_type: "",
  plate_number: "",
  driver_name: "",
  start_date: null,
  end_date: null,
};

const UPDATABLE_FIELDS = new Set<Path<MovementDetailFormValues>>([
  "plate_number",
  "trailer_chassis",
  "driver_name",
  "driver_license",
  "transportista",
  "seal_number",
  "country_of_origin",
  "aduana",
  "customs_decaration_number",
  "packages",
  "customer",
  "product",
  "container_number",
  "transport_unit_id",
]);

export function AccessControlPage() {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();
  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] =
    useState<AccessControlFilters>(EMPTY_FILTERS);
  const [isGateEntryOpen, setIsGateEntryOpen] = useState(false);
  const [entryStartedAt, setEntryStartedAt] = useState<EntryStartedAt | null>(
    null,
  );
  const [selectedReceptionId, setSelectedReceptionId] = useState<string | null>(
    null,
  );

  const payloadAccessControl = useMemo<GetAccessControlRequest>(() => {
    return {
      company_id: companyId,
      module_code: moduleCode,
      driver_name: (appliedFilters.driver_name ?? "").trim(),
      plate_number: (appliedFilters.plate_number ?? "").trim(),
      document_type: (appliedFilters.document_type ?? "").trim(),
      ducat_number: (appliedFilters.ducat_number ?? "").trim(),
      document_number: (appliedFilters.document_number ?? "").trim(),
      start_date: toApiDate(appliedFilters.start_date),
      end_date: toApiDate(appliedFilters.end_date),
      page_number: pageNumber,
      page_size: PAGE_SIZE,
    };
  }, [companyId, moduleCode, appliedFilters, pageNumber]);

  const vehiclesPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
    }),
    [companyId, moduleCode],
  );

  const detailPayload = useMemo(
    () =>
      selectedReceptionId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            reception_id: selectedReceptionId,
          }
        : null,
    [companyId, moduleCode, selectedReceptionId],
  );

  const {
    GetAccessControl,
    GetAccessControlDetail,
    CreateAccessControl,
    UpdateAccessControl,
    AddDucatsToReception,
    GetVehicles,
  } = useAccessControl({
    payloadAccessControl,
    vehiclesPayload,
    detailPayload,
  });

  const { data: accessControl, isLoading, isFetching } = GetAccessControl;
  const {
    data: detail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = GetAccessControlDetail;

  const movements = accessControl?.data ?? [];
  const totalRecords = accessControl?.total_count ?? 0;
  const vehicleOptions = Array.isArray(GetVehicles.data)
    ? GetVehicles.data
    : [];

  const metrics = useMemo(
    () => getAccessControlMetrics(accessControl?.stats, totalRecords),
    [accessControl?.stats, totalRecords],
  );

  const handleApplyFilters = useCallback((filters: AccessControlFilters) => {
    setAppliedFilters({
      ducat_number: (filters.ducat_number ?? "").trim(),
      document_number: (filters.document_number ?? "").trim(),
      document_type: (filters.document_type ?? "").trim(),
      plate_number: (filters.plate_number ?? "").trim(),
      driver_name: (filters.driver_name ?? "").trim(),
      start_date: filters.start_date,
      end_date: filters.end_date,
    });
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_FILTERS);
    setPageNumber(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleDetailClick = useCallback((item: ReceptionEntranceListItem) => {
    setSelectedReceptionId(item.id);
  }, []);

  const handleFieldUpdate = useCallback(
    async (name: Path<MovementDetailFormValues>, value: string) => {
      if (!selectedReceptionId) {
        handleRequestError("No se pudo actualizar el registro.");
        throw new Error("Missing context");
      }

      if (!UPDATABLE_FIELDS.has(name)) return;

      const payload: UpdateReceptionEntranceRequest = {
        company_id: companyId,
        module_code: moduleCode,
        reception_id: selectedReceptionId,
      };
      switch (name) {
        case "packages":
          payload.packages = value.trim() ? Number(value) : undefined;
          break;
        case "plate_number":
          payload.plate_number = value.trim();
          break;
        case "trailer_chassis":
          payload.trailer_chassis = value.trim();
          break;
        case "driver_name":
          payload.driver_name = value.trim();
          break;
        case "driver_license":
          payload.driver_license = value.trim();
          break;
        case "transportista":
          payload.transportista = value.trim();
          break;
        case "seal_number":
          payload.seal_number = value.trim();
          break;
        case "country_of_origin":
          payload.country_of_origin = value.trim();
          break;
        case "aduana":
          payload.aduana = value.trim();
          break;
        case "customs_decaration_number":
          payload.customs_declaration_number = value.trim();
          break;
        case "customer":
          payload.customer = value.trim();
          break;
        case "product":
          payload.product = value.trim();
          break;
        case "container_number":
          payload.container_number = value.trim();
          break;
        case "transport_unit_id":
          payload.transport_unit_id = value.trim();
          break;
        default:
          return;
      }

      try {
        await UpdateAccessControl.mutateAsync(payload);
        handleRequestSuccess("Campo actualizado exitosamente");
        setSelectedReceptionId(null);
      } catch (error) {
        const mappedError = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mappedError?.description || "Error al actualizar el registro",
        );
        throw error;
      }
    },
    [
      selectedReceptionId,
      UpdateAccessControl,
      handleRequestError,
      handleRequestSuccess,
    ],
  );

  const handleDucatUpdate = useCallback(
    async (ducatId: string, ducatNumber: string) => {
      if (!selectedReceptionId) {
        handleRequestError("No se pudo actualizar la DUCA.");
        throw new Error("Missing context");
      }

      try {
        await UpdateAccessControl.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          reception_id: selectedReceptionId,
          ducats: [{ id: ducatId, ducat_number: ducatNumber.trim() }],
        });
        handleRequestSuccess("DUCA actualizada exitosamente");
        setSelectedReceptionId(null);
      } catch (error) {
        const mappedError = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mappedError?.description || "Error al actualizar la DUCA",
        );
        throw error;
      }
    },
    [
      selectedReceptionId,
      UpdateAccessControl,
      handleRequestError,
      handleRequestSuccess,
    ],
  );

  const handleAddDucats = useCallback(
    async (ducatNumbers: string[]) => {
      if (!selectedReceptionId) {
        handleRequestError("No se pudo agregar la DUCA.");
        throw new Error("Missing context");
      }

      try {
        await AddDucatsToReception.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          reception_id: selectedReceptionId,
          ducat_numbers: ducatNumbers,
        });
        handleRequestSuccess("DUCA agregada exitosamente");
      } catch (error) {
        const mappedError = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mappedError?.description || "Error al agregar la DUCA",
        );
        throw error;
      }
    },
    [
      selectedReceptionId,
      AddDucatsToReception,
      handleRequestError,
      handleRequestSuccess,
    ],
  );

  const handleOpenGateEntry = useCallback(() => {
    const now = dayjs();
    setEntryStartedAt({
      start_date: now.format("YYYY-MM-DD"),
      start_time: now.format("HH:mm:ss"),
    });
    setIsGateEntryOpen(true);
  }, []);

  const handleCloseGateEntry = useCallback(() => {
    setIsGateEntryOpen(false);
    setEntryStartedAt(null);
  }, []);

  const handleGateEntrySubmit = useCallback(
    (data: GateEntryFormValues, documentType: DocumentType) => {
      if (!data.transportUnitId.trim()) {
        handleRequestError("Debe seleccionar una unidad de transporte.");
        return;
      }

      if (!entryStartedAt) {
        handleRequestError(
          "No se capturó la hora de inicio. Vuelva a abrir el registro.",
        );
        return;
      }

      const createPayload = mapGateEntryToCreateRequest(
        data,
        documentType,
        companyId,
        moduleCode,
        entryStartedAt,
      );

      CreateAccessControl.mutate(createPayload, {
        onSuccess: () => {
          setIsGateEntryOpen(false);
          setEntryStartedAt(null);
          setPageNumber(1);
          handleRequestSuccess("Entrada registrada exitosamente");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al registrar la entrada",
          );
        },
      });
    },
    [
      entryStartedAt,
      CreateAccessControl,
      handleRequestError,
      handleRequestSuccess,
    ],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {isLoading && <Loader title="Cargando control de acceso..." />}

      <AccessControlHeader />

      <AccessControlStats metrics={metrics} />

      <AccessControlActions onGiveEntry={handleOpenGateEntry} />

      <AccessControlFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <MovementsQueue
        data={movements}
        currentPage={accessControl?.page_number ?? pageNumber}
        totalRecords={totalRecords}
        pageSize={accessControl?.page_size ?? PAGE_SIZE}
        onPageChange={handlePageChange}
        isFetching={isFetching}
        onDetailClick={handleDetailClick}
      />

      <MovementDetailModal
        isOpen={Boolean(selectedReceptionId)}
        receptionId={selectedReceptionId}
        detail={detail}
        isLoading={isDetailLoading || isDetailFetching}
        onClose={() => setSelectedReceptionId(null)}
        onFieldUpdate={handleFieldUpdate}
        onDucatUpdate={handleDucatUpdate}
        onDucatAdd={handleAddDucats}
      />

      <GateEntryModal
        isOpen={isGateEntryOpen}
        onClose={handleCloseGateEntry}
        onSubmit={handleGateEntrySubmit}
        isSubmitting={CreateAccessControl.isPending}
        vehicleOptions={vehicleOptions}
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
