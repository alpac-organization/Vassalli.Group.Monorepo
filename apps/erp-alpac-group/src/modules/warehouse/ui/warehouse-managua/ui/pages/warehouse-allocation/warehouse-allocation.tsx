import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper, Button, Dropdown, InputText, Tabs } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { DocumentEnum } from "@app/core/enums/document.enum";
import { useWarehouseAllocation } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useWarehouseAllocation";
import { PendingAssignmentsTable } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/pending-assignments-table/pending-assignments-table";
import { AssignmentsTable } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignments-table/assignments-table";
import { AssignmentModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignment-modal/assignment-modal";
import type { AssignmentModalStep } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignment-modal/types/assignment-modal.types";
import { AssignmentDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignment-detail-modal/assignment-detail-modal";
import { DOCUMENT_TYPE_OPTIONS } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/utils/utils";
import type { PendingAssignmentItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-pending-assignments";
import type { WarehouseAssignmentListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignments";
import { Loader } from "@app/shared/components/loaders/loader";

const PAGE_SIZE = 10;

const inputClassName =
  "rounded-md! border-slate-300! dark:border-slate-600! bg-white! dark:bg-slate-800!";
const labelClassName =
  "text-slate-600! dark:text-slate-300! text-[13px]! font-medium!";

type PendingFilters = {
  driver_name: string;
  plate_number: string;
  document_type: string;
};

const EMPTY_PENDING_FILTERS: PendingFilters = {
  driver_name: "",
  plate_number: "",
  document_type: "",
};

function resolveDocumentTypeKey(documentType: unknown): string {
  const value =
    typeof documentType === "object" && documentType !== null
      ? (documentType as { value?: unknown }).value
      : documentType;
  return value === DocumentEnum.DUCA.value ? "DUCA" : "CustomsDeclaration";
}

export function WarehouseAllocationPage() {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const [pendingPage, setPendingPage] = useState(1);
  const [assignmentsPage, setAssignmentsPage] = useState(1);
  const [pendingFilters, setPendingFilters] = useState<PendingFilters>(
    EMPTY_PENDING_FILTERS,
  );
  const [selectedItem, setSelectedItem] = useState<PendingAssignmentItem | null>(
    null,
  );
  const [assignmentStep, setAssignmentStep] = useState<AssignmentModalStep>(1);
  const [detailReceptionId, setDetailReceptionId] = useState<string | null>(
    null,
  );
  const [positionRackId, setPositionRackId] = useState<string | undefined>(
    undefined,
  );
  const [positionLotId, setPositionLotId] = useState<string | undefined>(
    undefined,
  );

  const pendingPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      driver_name: pendingFilters.driver_name.trim() || undefined,
      plate_number: pendingFilters.plate_number.trim() || undefined,
      document_type: pendingFilters.document_type.trim() || undefined,
      page_number: pendingPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, pendingFilters, pendingPage],
  );

  const assignmentsPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: assignmentsPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, assignmentsPage],
  );

  const detailPayload = useMemo(
    () =>
      detailReceptionId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            reception_id: detailReceptionId,
          }
        : null,
    [companyId, moduleCode, detailReceptionId],
  );

  const availableWarehousesPayload = useMemo(() => {
    if (!selectedItem) return null;
    return {
      company_id: companyId,
      module_code: moduleCode,
      document_type: resolveDocumentTypeKey(selectedItem.document_type),
      rack_id: positionRackId,
      lot_id: positionLotId,
    };
  }, [selectedItem, companyId, moduleCode, positionRackId, positionLotId]);

  const catalogPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
    }),
    [companyId, moduleCode],
  );

  const machineriesPayload = selectedItem || detailReceptionId ? catalogPayload : null;
  const staffsPayload = selectedItem || detailReceptionId ? catalogPayload : null;

  const {
    GetPendingAssignments,
    GetWarehouseAssignments,
    GetWarehouseAssignmentDetail,
    GetAvailableWarehouses,
    GetWarehouseMachineries,
    GetWarehouseStaffs,
    CreateWarehouseAssignment,
    CreateUnloadingDetails,
    CreateUnloadingCrew,
    CreateUnloadingMachinery,
    CompleteWarehouseAssignment,
  } = useWarehouseAllocation({
    pendingPayload,
    assignmentsPayload,
    detailPayload,
    availableWarehousesPayload,
    machineriesPayload,
    staffsPayload,
  });

  const pendingItems = GetPendingAssignments.data?.data ?? [];
  const pendingTotal = GetPendingAssignments.data?.total_count ?? 0;
  const assignmentItems = GetWarehouseAssignments.data?.data ?? [];
  const assignmentsTotal = GetWarehouseAssignments.data?.total_count ?? 0;
  const detail = GetWarehouseAssignmentDetail.data ?? null;
  const warehouses = Array.isArray(GetAvailableWarehouses.data)
    ? GetAvailableWarehouses.data
    : [];
  const machineries = Array.isArray(GetWarehouseMachineries.data)
    ? GetWarehouseMachineries.data
    : [];
  const staffs = Array.isArray(GetWarehouseStaffs.data)
    ? GetWarehouseStaffs.data
    : [];

  const handleOpenAssignment = useCallback((item: PendingAssignmentItem) => {
    setSelectedItem(item);
    setAssignmentStep(1);
    setPositionRackId(undefined);
    setPositionLotId(undefined);
  }, []);

  const handleCloseAssignment = useCallback(() => {
    setSelectedItem(null);
    setAssignmentStep(1);
  }, []);

  const handleDetailClick = useCallback((item: WarehouseAssignmentListItem) => {
    setDetailReceptionId(item.reception_id);
  }, []);

  const handleRequestPositions = useCallback(
    (payload: { rack_id?: string; lot_id?: string }) => {
      setPositionRackId(payload.rack_id);
      setPositionLotId(payload.lot_id);
    },
    [],
  );

  const handleCreateAssignment = useCallback(
    (payload: Parameters<typeof CreateWarehouseAssignment.mutate>[0]) => {
      CreateWarehouseAssignment.mutate(payload, {
        onSuccess: () => {
          setAssignmentStep(2);
          handleRequestSuccess("Ubicación asignada correctamente");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al asignar la bodega",
          );
        },
      });
    },
    [CreateWarehouseAssignment, getMappedError, handleRequestError, handleRequestSuccess],
  );

  const handleCreateUnloadingDetails = useCallback(
    (payload: Parameters<typeof CreateUnloadingDetails.mutate>[0]) => {
      CreateUnloadingDetails.mutate(payload, {
        onSuccess: () => {
          setAssignmentStep(3);
          handleRequestSuccess("Detalles de descarga guardados");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al guardar los detalles de descarga",
          );
        },
      });
    },
    [CreateUnloadingDetails, getMappedError, handleRequestError, handleRequestSuccess],
  );

  const handleCreateUnloadingCrew = useCallback(
    (payload: Parameters<typeof CreateUnloadingCrew.mutate>[0]) => {
      CreateUnloadingCrew.mutate(payload, {
        onSuccess: () => {
          handleRequestSuccess("Cuadrilla registrada correctamente");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al registrar la cuadrilla",
          );
        },
      });
    },
    [CreateUnloadingCrew, getMappedError, handleRequestError, handleRequestSuccess],
  );

  const handleCreateUnloadingMachinery = useCallback(
    (payload: Parameters<typeof CreateUnloadingMachinery.mutate>[0]) => {
      CreateUnloadingMachinery.mutate(payload, {
        onSuccess: () => {
          handleRequestSuccess("Maquinaria registrada correctamente");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al registrar la maquinaria",
          );
        },
      });
    },
    [CreateUnloadingMachinery, getMappedError, handleRequestError, handleRequestSuccess],
  );

  const handleCompleteAssignment = useCallback(
    (payload: Parameters<typeof CompleteWarehouseAssignment.mutate>[0]) => {
      CompleteWarehouseAssignment.mutate(payload, {
        onSuccess: () => {
          handleCloseAssignment();
          setDetailReceptionId(null);
          handleRequestSuccess("Asignación completada exitosamente");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al completar la asignación",
          );
        },
      });
    },
    [
      CompleteWarehouseAssignment,
      handleCloseAssignment,
      getMappedError,
      handleRequestError,
      handleRequestSuccess,
    ],
  );

  const handleApplyPendingFilters = useCallback(() => {
    setPendingPage(1);
  }, []);

  const handleClearPendingFilters = useCallback(() => {
    setPendingFilters(EMPTY_PENDING_FILTERS);
    setPendingPage(1);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {(GetPendingAssignments.isLoading || GetWarehouseAssignments.isLoading) && (
        <Loader title="Cargando asignaciones de bodega..." />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="m-0!">Asignación de bodega</h1>
        <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
          Asigna una ubicación a los documentos con recepción completada y
          registra la cuadrilla y maquinaria de descarga.
        </small>
      </div>

      <div className="flex flex-col gap-4 rounded-md! border! border-slate-200! dark:border-slate-700! bg-slate-50! dark:bg-slate-900! p-3">
        <h3 className="p-0! m-0!">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col min-w-0">
            <InputText
              label="Conductor"
              className={inputClassName}
              labelClassName={labelClassName}
              type="text"
              errorVariant="tooltip"
              placeholder="Buscar por conductor"
              value={pendingFilters.driver_name}
              onChange={(e) =>
                setPendingFilters((f) => ({ ...f, driver_name: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col min-w-0">
            <InputText
              label="Placa"
              className={inputClassName}
              labelClassName={labelClassName}
              type="text"
              errorVariant="tooltip"
              placeholder="Buscar por placa"
              value={pendingFilters.plate_number}
              onChange={(e) =>
                setPendingFilters((f) => ({ ...f, plate_number: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col min-w-0">
            <Dropdown
              appearance="dark"
              label="Tipo de documento"
              placeholder="Todos"
              options={DOCUMENT_TYPE_OPTIONS}
              value={pendingFilters.document_type || undefined}
              onChange={(value) =>
                setPendingFilters((f) => ({
                  ...f,
                  document_type: String(value ?? ""),
                }))
              }
              labelClassName={labelClassName}
              className={`${inputClassName} h-[42px]!`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="giant"
              className="rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
              label="Aplicar"
              onClick={handleApplyPendingFilters}
            />
            <Button
              size="giant"
              className="rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
              label="Limpiar"
              onClick={handleClearPendingFilters}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="p-0! m-0! text-lg!">Registros</h3>
        <Tabs
          activeTab="pending"
          tabItems={[
            {
              id: "pending",
              label: "Pendientes",
              render: () => (
                <PendingAssignmentsTable
                  data={pendingItems}
                  currentPage={GetPendingAssignments.data?.page_number ?? pendingPage}
                  totalRecords={pendingTotal}
                  pageSize={GetPendingAssignments.data?.page_size ?? PAGE_SIZE}
                  onPageChange={setPendingPage}
                  onAssignClick={handleOpenAssignment}
                  isFetching={GetPendingAssignments.isFetching}
                />
              ),
            },
            {
              id: "assignments",
              label: "Asignaciones",
              render: () => (
                <AssignmentsTable
                  data={assignmentItems}
                  currentPage={GetWarehouseAssignments.data?.page_number ?? assignmentsPage}
                  totalRecords={assignmentsTotal}
                  pageSize={GetWarehouseAssignments.data?.page_size ?? PAGE_SIZE}
                  onPageChange={setAssignmentsPage}
                  onDetailClick={handleDetailClick}
                  isFetching={GetWarehouseAssignments.isFetching}
                />
              ),
            },
          ]}
        />
      </div>

      <AssignmentModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        companyId={companyId}
        moduleCode={moduleCode}
        step={assignmentStep}
        warehouses={warehouses}
        machineries={machineries}
        staffs={staffs}
        isLoadingWarehouses={GetAvailableWarehouses.isFetching}
        isCreating={CreateUnloadingDetails.isPending}
        isCompleting={CompleteWarehouseAssignment.isPending}
        onStepChange={setAssignmentStep}
        onRequestPositions={handleRequestPositions}
        onCreateAssignment={handleCreateAssignment}
        onCreateUnloadingDetails={handleCreateUnloadingDetails}
        onCreateUnloadingCrew={handleCreateUnloadingCrew}
        onCreateUnloadingMachinery={handleCreateUnloadingMachinery}
        onCompleteAssignment={handleCompleteAssignment}
        onClose={handleCloseAssignment}
      />

      <AssignmentDetailModal
        isOpen={Boolean(detailReceptionId)}
        detail={detail}
        companyId={companyId}
        moduleCode={moduleCode}
        machineries={machineries}
        staffs={staffs}
        isDetailLoading={GetWarehouseAssignmentDetail.isLoading}
        isCreating={CreateUnloadingCrew.isPending || CreateUnloadingMachinery.isPending}
        isCompleting={CompleteWarehouseAssignment.isPending}
        onCreateUnloadingCrew={handleCreateUnloadingCrew}
        onCreateUnloadingMachinery={handleCreateUnloadingMachinery}
        onCompleteAssignment={handleCompleteAssignment}
        onClose={() => setDetailReceptionId(null)}
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