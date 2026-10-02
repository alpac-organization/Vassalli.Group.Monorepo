import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Modal, Button } from "@alpac/design-system";
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
  isDucaDocumentType,
  parseAdditionalData,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/mapMovementDetail";
import { useAccessControl } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAccessControl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import type { UpdateReceptionEntranceRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/update-access-control";
import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";
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
  const [deleteReception, setDeleteReception] = useState<ReceptionEntranceListItem | null>(null);

  const payloadAccessControl = useMemo<GetAccessControlRequest>(() => {
    const hasDateFilter = Boolean(
      appliedFilters.start_date || appliedFilters.end_date,
    );

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

    const docNumber = (
      appliedFilters.document_number ||
      appliedFilters.ducat_number ||
      ""
    ).trim();

    return {
      company_id: companyId,
      module_code: moduleCode,
      only_day: !hasDateFilter,
      plate_number: (appliedFilters.plate_number ?? "").trim() || undefined,
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
    DeleteAccessControl,
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

  const handleDeleteClick = useCallback((item: ReceptionEntranceListItem) => {
    setDeleteReception(item);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setDeleteReception(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteReception) return;
    const receptionId =
      deleteReception.reception_entrance_id || deleteReception.id;
    if (!receptionId) return;

    try {
      await DeleteAccessControl.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        reception_id: receptionId,
        reception_entrance_id: receptionId,
      });
      handleRequestSuccess("Registro eliminado exitosamente");
      if (movements.length === 1 && pageNumber > 1) {
        setPageNumber((p) => p - 1);
      }
    } catch (error) {
      const mappedError = getMappedError(error as ApiErrorResponse);
      handleRequestError(
        mappedError?.description || "Error al eliminar el registro",
      );
    } finally {
      setDeleteReception(null);
    }
  }, [
    deleteReception,
    DeleteAccessControl,
    companyId,
    moduleCode,
    handleRequestSuccess,
    handleRequestError,
    getMappedError,
    movements.length,
    pageNumber,
  ]);

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

      const isDuca = detail ? isDucaDocumentType(detail) : false;
      const parsedAdd = parseAdditionalData(detail?.additional_data);

      const existingDucats: string[] = (
        (parsedAdd?.document_numbers ?? [])
          .filter(
            (d) =>
              Number(d.document_type) === Number(DocumentEnum.DUCA.value) ||
              d.document_type === 1 ||
              String(d.document_type) === "1" ||
              String(d.document_type).toUpperCase().includes("DUCA") ||
              d.document_type === 3 ||
              String(d.document_type) === "3",
          )
          .map((d) => d.document_numbers)
      ).filter(Boolean);

      const existingCustomsDecNumber =
        parsedAdd?.document_numbers?.find(
          (d) =>
            Number(d.document_type) ===
              Number(DocumentEnum.CustomsDeclaration.value) ||
            d.document_type === 2 ||
            String(d.document_type) === "2" ||
            String(d.document_type).toUpperCase().includes("CUSTOM") ||
            d.document_type === 4 ||
            String(d.document_type) === "4",
        )?.document_numbers ??
        "";

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
            transport_unit: value.trim() ? Number(value) : undefined,
          };
          break;

        case "seal_number":
          payload.general_information = {
            seal_number: value.trim(),
            document_type: isDuca
              ? Number(DocumentEnum.DUCA.value)
              : Number(DocumentEnum.CustomsDeclaration.value),
            ducat_numbers: isDuca ? existingDucats : undefined,
            customs_declaration_number: !isDuca ? existingCustomsDecNumber : undefined,
          };
          break;
        case "country_of_origin":
          payload.general_information = {
            country_origin: value.trim(),
            document_type: isDuca
              ? Number(DocumentEnum.DUCA.value)
              : Number(DocumentEnum.CustomsDeclaration.value),
            ducat_numbers: isDuca ? existingDucats : undefined,
            customs_declaration_number: !isDuca ? existingCustomsDecNumber : undefined,
          };
          break;
        case "container_number":
          payload.general_information = {
            container_number: value.trim(),
            document_type: isDuca
              ? Number(DocumentEnum.DUCA.value)
              : Number(DocumentEnum.CustomsDeclaration.value),
            ducat_numbers: isDuca ? existingDucats : undefined,
            customs_declaration_number: !isDuca ? existingCustomsDecNumber : undefined,
          };
          break;
        case "custom_branch":
          payload.general_information = {
            custom_branch_id: value.trim(),
            document_type: isDuca
              ? Number(DocumentEnum.DUCA.value)
              : Number(DocumentEnum.CustomsDeclaration.value),
            ducat_numbers: isDuca ? existingDucats : undefined,
            customs_declaration_number: !isDuca ? existingCustomsDecNumber : undefined,
          };
          break;
        case "customs_decaration_number":
          payload.general_information = {
            customs_declaration_number: value.trim(),
            document_type: Number(DocumentEnum.CustomsDeclaration.value),
          };
          break;

        default:
          return;
      }

      try {
        await UpdateAccessControl.mutateAsync(payload);
        handleRequestSuccess("Campo actualizado exitosamente");
        GetAccessControlDetail.refetch();
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
      detail,
      UpdateAccessControl,
      GetAccessControlDetail,
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

      let allDucatNumbers: string[] = [];
      if (ducaDocs.length > 0) {
        allDucatNumbers = ducaDocs.map((d) =>
          d.document_id === ducatId ? ducatNumber.trim() : d.document_numbers,
        );
      }

      if (allDucatNumbers.length === 0) {
        allDucatNumbers = [ducatNumber.trim()];
      }

      try {
        await UpdateAccessControl.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          reception_id: selectedReceptionId,
          reception_entrance_id: selectedReceptionId,
          general_information: {
            document_type: Number(DocumentEnum.DUCA.value),
            ducat_numbers: allDucatNumbers,
          },
        });

        handleRequestSuccess("DUCA actualizada exitosamente");
        GetAccessControlDetail.refetch();
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
      detail,
      UpdateAccessControl,
      GetAccessControlDetail,
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

      const existingDucatNumbers = ducaDocs.map((d) => d.document_numbers);
      const cleanNewDucats = ducatNumbers.map((d) => d.trim()).filter(Boolean);
      const allDucatNumbers = [...existingDucatNumbers, ...cleanNewDucats];

      try {
        await UpdateAccessControl.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          reception_id: selectedReceptionId,
          reception_entrance_id: selectedReceptionId,
          general_information: {
            document_type: Number(DocumentEnum.DUCA.value),
            ducat_numbers: allDucatNumbers,
          },
        });
        handleRequestSuccess("DUCA agregada exitosamente");
        GetAccessControlDetail.refetch();
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
        onDeleteClick={handleDeleteClick}
      />

      <Modal
        isOpen={Boolean(deleteReception)}
        onClose={handleCloseDelete}
        variant="warning"
        size="md"
        title="Confirmar eliminación"
      >
        <div className="flex flex-col gap-4 min-w-0 p-4">
          <p className="text-slate-600 dark:text-slate-300 text-center">
            ¿Está seguro que desea eliminar el registro{" "}
            <span className="font-bold">
              {deleteReception?.reception_code
                ? `con código ${deleteReception.reception_code}`
                : deleteReception?.plate_number
                ? `con placa ${deleteReception.plate_number}`
                : deleteReception?.container_number
                ? `con contenedor ${deleteReception.container_number}`
                : ""}
            </span>
            {deleteReception?.driver_name ? (
              <>
                {" "}y conductor{" "}
                <span className="font-bold">{deleteReception.driver_name}</span>
              </>
            ) : null}
            ?
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              label="Cancelar"
              onClick={handleCloseDelete}
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-800"
            />
            <Button
              type="button"
              label="Eliminar"
              onClick={handleConfirmDelete}
              isLoading={DeleteAccessControl.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            />
          </div>
        </div>
      </Modal>

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
                : exitReception?.plate_number
                ? `con placa ${exitReception.plate_number}`
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
              exitReception && detail?.id === exitReception.id
                ? (detail?.created_at
                    ? detail.created_at.slice(0, 10)
                    : exitReception.arrival_date)
                : exitReception?.arrival_date
            }
            entryTime={
              exitReception && detail?.id === exitReception.id
                ? (detail?.created_at
                    ? detail.created_at.slice(11, 19)
                    : exitReception.arrival_time)
                : exitReception?.arrival_time
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
