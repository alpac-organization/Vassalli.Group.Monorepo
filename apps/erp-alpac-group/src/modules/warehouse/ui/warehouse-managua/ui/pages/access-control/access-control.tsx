import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Modal } from "@alpac/design-system";
import { AccessControlHeader } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-header/access-control-header";
import { AccessControlStats } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-stats/access-control-stats";
import { AccessControlActions } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-actions/access-control-actions";
import { AccessControlFiltersBar } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/access-control-filters";
import { MovementsQueue } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/movements-queue";
import { MovementDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/movement-detail-modal";
import { GenerateExitModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/generate-exit-modal";
import type { GenerateExitFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/types/generate-exit-modal.types";
import { GateEntryModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/gate-entry-modal";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { MovementDetailFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/types/movement-detail.types";
import { getAccessControlMetrics } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/filter-movements";
import {
  toApiDate,
  mapGateEntryToCreateRequest,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/mapping-access-control";
import {
  parseAdditionalData,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/mapMovementDetail";
import { useAccessControl } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAccessControl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type {
  DucatNumberUpdateItem,
  UpdateReceptionEntranceRequest,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/update-access-control";
import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";
import type { Path } from "react-hook-form";

const PAGE_SIZE = 10;
const EMPTY_FILTERS: AccessControlFilters = {
  document_number: "",
  document_type: "",
  vehicle_plate_number: "",
  container_number: "",
};

const UPDATABLE_FIELDS = new Set<Path<MovementDetailFormValues>>([
  "document_type",
  "plate_number",
  "trailer_chassis",
  "driver_name",
  "driver_license",
  "transportista",
  "seal_number",
  "country_of_origin",
  "custom_branch",
  "customs_decaration_number",
  "container_number",
  "transport_unit",
]);

export function AccessControlPage() {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const {
    handleRequestError,
    handleRequestSuccess,
    AlertComponent,
  } = useAlertState();
  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] =
    useState<AccessControlFilters>(EMPTY_FILTERS);
  const [isGateEntryOpen, setIsGateEntryOpen] = useState(false);
  const [selectedReceptionId, setSelectedReceptionId] = useState<string | null>(
    null,
  );
  const [exitReception, setExitReception] = useState<ReceptionEntranceListItem | null>(null);

  const payloadAccessControl = useMemo<GetAccessControlRequest>(() => {
    const plateNumber = (appliedFilters.vehicle_plate_number ?? "").trim();
    const containerNumber = (appliedFilters.container_number ?? "").trim();
    const docNumber = (appliedFilters.document_number ?? "").trim();

    let docTypeNumber: number | undefined = undefined;
    if (appliedFilters.document_type) {
      const parsedNum = Number(appliedFilters.document_type);
      if (!Number.isNaN(parsedNum)) {
        docTypeNumber = parsedNum;
      } else if (
        String(appliedFilters.document_type).toUpperCase().includes("DUCA")
      ) {
        docTypeNumber = Number(DocumentEnum.DUCA.value);
      } else if (
        String(appliedFilters.document_type).toUpperCase().includes("CUSTOM")
      ) {
        docTypeNumber = Number(DocumentEnum.CustomsDeclaration.value);
      }
    }

    const hasFilter = Boolean(
      plateNumber ||
      containerNumber ||
      docNumber ||
      docTypeNumber !== undefined,
    );

    return {
      company_id: companyId,
      module_code: moduleCode,
      only_day: !hasFilter,
      plate_number: plateNumber || undefined,
      container_number: containerNumber || undefined,
      contaniner_number: containerNumber || undefined,
      document_type: docTypeNumber,
      document_number: docNumber || undefined,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
    };
  }, [companyId, moduleCode, appliedFilters, pageNumber]);

  const detailReceptionId =
    selectedReceptionId ??
    exitReception?.reception_entrance_id ??
    exitReception?.id ??
    null;

  const detailPayload = useMemo(
    () =>
      detailReceptionId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            reception_id: detailReceptionId,
            reception_entrance_id: detailReceptionId,
          }
        : null,
    [companyId, moduleCode, detailReceptionId],
  );

  const {
    GetAccessControl,
    GetAccessControlDetail,
    CreateAccessControl,
    UpdateAccessControl,
    GenerateExitAccessControl,
  } = useAccessControl({
    payloadAccessControl,
    detailPayload,
  });

  const { data: accessControl, isLoading, isFetching } = GetAccessControl;
  const {
    data: detail,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = GetAccessControlDetail;

  const movements = useMemo(() => {
    return (accessControl?.data ?? []).map((item) => ({
      ...item,
      id: item.id || item.reception_entrance_id,
    }));
  }, [accessControl?.data]);

  const totalRecords = accessControl?.total ?? accessControl?.total_count ?? 0;

  const metrics = useMemo(
    () => getAccessControlMetrics(accessControl?.stats, totalRecords),
    [accessControl?.stats, totalRecords],
  );

  const handleApplyFilters = useCallback((filters: AccessControlFilters) => {
    setAppliedFilters({
      document_number: (filters.document_number ?? "").trim(),
      document_type: (filters.document_type ?? "").trim(),
      vehicle_plate_number: (filters.vehicle_plate_number ?? "").trim(),
      container_number: (filters.container_number ?? "").trim(),
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
    setSelectedReceptionId(item.reception_entrance_id || item.id || null);
  }, []);

  const handleExitClick = useCallback((item: ReceptionEntranceListItem) => {
    setExitReception(item);
  }, []);

  const handleCloseExit = useCallback(() => {
    setExitReception(null);
  }, []);

  const handleGenerateExit = useCallback(
    async (data: GenerateExitFormValues) => {
      if (!exitReception) return;
      const receptionId =
        exitReception.reception_entrance_id || exitReception.id;
      if (!receptionId) return;

      try {
        await GenerateExitAccessControl.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          reception_id: receptionId,
          reception_entrance_id: receptionId,
          exit_vehicle: data.exit_vehicle,
          exit_container: data.exit_container,
          exit_date: data.specifyDateTime ? toApiDate(data.exitDate) : undefined,
          exit_time:
            data.specifyDateTime && data.exitTime
              ? (dayjs.isDayjs(data.exitTime)
                  ? data.exitTime
                  : dayjs(String(data.exitTime))
                )
                  .second(0)
                  .format("HH:mm:ss")
              : undefined,
        });
        handleRequestSuccess("Salida registrada exitosamente");
      } catch (error) {
        const mappedError = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mappedError?.description || "Error al registrar la salida",
        );
      } finally {
        setExitReception(null);
      }
    },
    [
      exitReception,
      GenerateExitAccessControl,
      companyId,
      moduleCode,
      handleRequestSuccess,
      handleRequestError,
      getMappedError,
    ],
  );


  const handleEvidenceUpdate = useCallback(
    async (toAdd: string[], toDelete: string[]) => {
      if (!selectedReceptionId) return;

      const parsedAdditional = parseAdditionalData(detail?.additional_data);
      const evidenceList = parsedAdditional?.evidence_urls ?? [];
      const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

      const evidenceIdsToDelete: string[] = toDelete
        .map((urlOrId) => {
          if (uuidRegex.test(urlOrId)) {
            return urlOrId;
          }
          const found = evidenceList.find(
            (e) => (e.image_url ?? e.document_url) === urlOrId,
          );
          return found?.image_id ?? found?.document_id ?? null;
        })
        .filter((id): id is string => Boolean(id));

      const payload: UpdateReceptionEntranceRequest = {
        company_id: companyId,
        module_code: moduleCode,
        reception_id: selectedReceptionId,
        reception_entrance_id: selectedReceptionId,
        evidence_base64: toAdd.length > 0 ? toAdd : undefined,
        evidence_ids_to_delete:
          evidenceIdsToDelete.length > 0 ? evidenceIdsToDelete : undefined,
      };

      try {
        await UpdateAccessControl.mutateAsync(payload);
        handleRequestSuccess("Evidencia actualizada exitosamente");
        GetAccessControlDetail.refetch();
      } catch (error) {
        const mappedError = getMappedError(error as ApiErrorResponse);
        handleRequestError(
          mappedError?.description || "Error al actualizar la evidencia",
        );
        throw error;
      }
    },
    [
      selectedReceptionId,
      detail?.additional_data,
      UpdateAccessControl,
      companyId,
      moduleCode,
      handleRequestSuccess,
      handleRequestError,
      getMappedError,
      GetAccessControlDetail,
    ],
  );

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
        reception_entrance_id: selectedReceptionId,
      };

      switch (name) {
        case "plate_number":
          payload.reception_transport_information = {
            vehicle_plate_number: value.trim(),
          };
          break;
        case "trailer_chassis":
          payload.reception_transport_information = {
            vehicle_chassis_number: value.trim(),
          };
          break;
        case "driver_name":
          payload.reception_transport_information = {
            driver_name: value.trim(),
          };
          break;
        case "driver_license":
          payload.reception_transport_information = {
            driver_license: value.trim(),
          };
          break;
        case "transportista":
          payload.reception_transport_information = {
            transportista: value.trim(),
          };
          break;
        case "transport_unit":
          payload.reception_transport_information = {
            transport_unit: value.trim()
              ? (!isNaN(Number(value)) ? Number(value) : value.trim())
              : undefined,
          };
          break;

        case "seal_number":
          payload.general_information = {
            seal_number: value.trim(),
          };
          break;
        case "country_of_origin":
          payload.general_information = {
            country_origin: value.trim(),
          };
          break;
        case "container_number":
          payload.general_information = {
            container_number: value.trim(),
          };
          break;
        case "custom_branch":
          payload.general_information = {
            custom_branch_id: value.trim(),
          };
          break;
        case "document_type": {
          const isDucaVal =
            value === "DUCA" ||
            value === "3" ||
            Number(value) === 3 ||
            value.toUpperCase().includes("DUCA");

          payload.general_information = {
            document_type: isDucaVal ? "DUCA" : "CustomsDeclaration",
          };
          break;
        }
        case "customs_decaration_number":
          payload.general_information = {
            customs_declaration_number: value.trim(),
            document_type: "CustomsDeclaration",
          };
          break;

        default:
          return;
      }

      try {
        await UpdateAccessControl.mutateAsync(payload);
        handleRequestSuccess("Campo actualizado exitosamente");
        GetAccessControlDetail.refetch();
        GetAccessControl.refetch();
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
      GetAccessControlDetail,
      GetAccessControl,
      companyId,
      moduleCode,
      handleRequestError,
      handleRequestSuccess,
      getMappedError,
    ],
  );

  const handleDucatUpdate = useCallback(
    async (ducatId: string, ducatNumber: string) => {
      if (!selectedReceptionId) {
        handleRequestError("No se pudo actualizar la DUCA.");
        throw new Error("Missing context");
      }

      const parsed = parseAdditionalData(detail?.additional_data);
      const ducaDocs = (parsed?.document_numbers ?? []).filter(
        (d) =>
          Number(d.document_type) === Number(DocumentEnum.DUCA.value) ||
          d.document_type === 1 ||
          String(d.document_type) === "1" ||
          String(d.document_type).toUpperCase().includes("DUCA") ||
          d.document_type === 3 ||
          String(d.document_type) === "3",
      );

      const ducatNumbersPayload: DucatNumberUpdateItem[] = ducaDocs.map((d) => {
        const orderId = d.operational_order_id || d.document_id || ducatId;
        const isTarget =
          d.document_id === ducatId ||
          d.operational_order_id === ducatId ||
          orderId === ducatId;
        return {
          operational_order_id: orderId,
          document_number: isTarget ? ducatNumber.trim() : d.document_numbers,
        };
      });

      if (ducatNumbersPayload.length === 0) {
        ducatNumbersPayload.push({
          operational_order_id: ducatId,
          document_number: ducatNumber.trim(),
        });
      }

      try {
        await UpdateAccessControl.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          reception_id: selectedReceptionId,
          reception_entrance_id: selectedReceptionId,
          general_information: {
            document_type: "DUCA",
            ducat_numbers: ducatNumbersPayload,
          },
        });

        handleRequestSuccess("DUCA actualizada exitosamente");
        GetAccessControlDetail.refetch();
        GetAccessControl.refetch();
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
      detail,
      UpdateAccessControl,
      GetAccessControlDetail,
      GetAccessControl,
      companyId,
      moduleCode,
      handleRequestError,
      handleRequestSuccess,
      getMappedError,
    ],
  );

  const handleAddDucats = useCallback(
    async (ducatNumbers: string[]) => {
      if (!selectedReceptionId) {
        handleRequestError("No se pudo agregar la DUCA.");
        throw new Error("Missing context");
      }

      const parsed = parseAdditionalData(detail?.additional_data);
      const ducaDocs = (parsed?.document_numbers ?? []).filter(
        (d) =>
          Number(d.document_type) === Number(DocumentEnum.DUCA.value) ||
          d.document_type === 1 ||
          String(d.document_type) === "1" ||
          String(d.document_type).toUpperCase().includes("DUCA") ||
          d.document_type === 3 ||
          String(d.document_type) === "3",
      );

      const cleanNewDucats = ducatNumbers.map((d) => d.trim()).filter(Boolean);
      if (cleanNewDucats.length === 0) return;

      const ducatNumbersPayload: DucatNumberUpdateItem[] = ducaDocs.map((d) => ({
        operational_order_id: d.operational_order_id || d.document_id || "",
        document_number: d.document_numbers,
      }));

      const emptyDoc = ducatNumbersPayload.find((d) => !d.document_number.trim());
      if (emptyDoc) {
        emptyDoc.document_number = cleanNewDucats[0];
      } else if (ducaDocs.length === 0) {
        ducatNumbersPayload.push({
          operational_order_id: selectedReceptionId,
          document_number: cleanNewDucats[0],
        });
      } else {
        ducatNumbersPayload.push({
          operational_order_id: crypto.randomUUID(),
          document_number: cleanNewDucats[0],
        });
      }

      try {
        await UpdateAccessControl.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          reception_id: selectedReceptionId,
          reception_entrance_id: selectedReceptionId,
          general_information: {
            document_type: "DUCA",
            ducat_numbers: ducatNumbersPayload,
          },
        });
        handleRequestSuccess("DUCA agregada exitosamente");
        GetAccessControlDetail.refetch();
        GetAccessControl.refetch();
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
      detail,
      companyId,
      moduleCode,
      UpdateAccessControl,
      GetAccessControlDetail,
      GetAccessControl,
      handleRequestError,
      handleRequestSuccess,
      getMappedError,
    ],
  );

  const handleOpenGateEntry = useCallback(() => {
    setIsGateEntryOpen(true);
  }, []);

  const handleCloseGateEntry = useCallback(() => {
    setIsGateEntryOpen(false);
  }, []);

  const handleGateEntrySubmit = useCallback(
    (data: GateEntryFormValues, documentType: DocumentType) => {
      if (!data.transportUnitId.trim()) {
        handleRequestError("Debe seleccionar una unidad de transporte.");
        return;
      }

      const createPayload = mapGateEntryToCreateRequest(
        data,
        documentType,
        companyId,
        moduleCode,
      );

      CreateAccessControl.mutate(createPayload, {
        onSuccess: () => {
          setIsGateEntryOpen(false);
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
      companyId,
      moduleCode,
      CreateAccessControl,
      handleRequestError,
      handleRequestSuccess,
      getMappedError,
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
        defaultValues={appliedFilters}
      />

      <MovementsQueue
        data={movements}
        currentPage={accessControl?.page_number ?? pageNumber}
        totalRecords={totalRecords}
        pageSize={accessControl?.page_size ?? PAGE_SIZE}
        onPageChange={handlePageChange}
        isFetching={isFetching}
        onDetailClick={handleDetailClick}
        onExitClick={handleExitClick}
      />

      <Modal
        isOpen={Boolean(exitReception)}
        onClose={handleCloseExit}
        variant="info"
        size="lg"
        title="Generar salida de movimiento"
      >
        <div className="flex flex-col gap-4 min-w-0 p-4">
          <p className="text-slate-600 dark:text-slate-300 text-center">
            ¿Está seguro que desea dar salida al registro{" "}
            <span className="font-bold">
              {exitReception?.reception_code
                ? `con código ${exitReception.reception_code}`
                : exitReception?.vehicle_plate_number
                ? `con placa ${exitReception.vehicle_plate_number}`
                : exitReception?.container_number
                ? `con contenedor ${exitReception.container_number}`
                : ""}
            </span>
            {exitReception?.driver_name ? (
              <>
                {" "}y conductor{" "}
                <span className="font-bold">{exitReception.driver_name}</span>
              </>
            ) : null}
            ?
          </p>
          <GenerateExitModal
            onClose={handleCloseExit}
            onSubmit={handleGenerateExit}
            isSubmitting={GenerateExitAccessControl.isPending}
            entryDate={
              detail?.created_at
                ? detail.created_at.slice(0, 10)
                : undefined
            }
            entryTime={
              detail?.created_at
                ? detail.created_at.slice(11, 19)
                : undefined
            }
          />
        </div>
      </Modal>

      <MovementDetailModal
        isOpen={Boolean(selectedReceptionId)}
        receptionId={selectedReceptionId}
        detail={detail}
        isLoading={isDetailLoading || isDetailFetching}
        onClose={() => setSelectedReceptionId(null)}
        onFieldUpdate={handleFieldUpdate}
        onDucatUpdate={handleDucatUpdate}
        onDucatAdd={handleAddDucats}
        onEvidenceUpdate={handleEvidenceUpdate}
      />

      <GateEntryModal
        isOpen={isGateEntryOpen}
        onClose={handleCloseGateEntry}
        onSubmit={handleGateEntrySubmit}
        isSubmitting={CreateAccessControl.isPending}
      />

      {AlertComponent}
    </m.div>
  );
}
