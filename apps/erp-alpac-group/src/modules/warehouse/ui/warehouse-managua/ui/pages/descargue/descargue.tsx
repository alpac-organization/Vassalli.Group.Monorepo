import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { Loader } from "@app/shared/components/loaders/loader";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { AssignmentOperationalStatus } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import type { AssignmentOperationalDetailsDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-details";
import { useBodegaViewerStore } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/stores/use-bodega-viewer-store";
import { DescargueHeader } from "./components/descargue-header/descargue-header";
import { DescargueFilters } from "./components/descargue-filters/descargue-filters";
import { DescargueTable } from "./components/descargue-table/descargue-table";
import { AssignmentDetailModal } from "../warehouse-assignment/components/assignment-detail-modal/assignment-detail-modal";
import { FinishDescargueModal } from "./components/finish-descargue-modal/finish-descargue-modal";
import type { PositioningInformation } from "./components/finish-descargue-modal/finish-descargue-modal";

const PAGE_SIZE = 10;

export function DescarguePage() {
  const { companyId, moduleCode } = useUserStore();
  const { baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  const { AlertComponent, handleRequestSuccess, handleRequestError } =
    useAlertState();

  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAssignmentForStart, setSelectedAssignmentForStart] =
    useState<AssignmentOperationalDto | null>(null);
  const [selectedAssignmentForFinish, setSelectedAssignmentForFinish] =
    useState<AssignmentOperationalDto | null>(null);
  const [isStartingTask, setIsStartingTask] = useState(false);
  const [isFinishingTask, setIsFinishingTask] = useState(false);

  const { setActiveDescargueAssignment, setBodega } = useBodegaViewerStore();

  // Consulta de asignaciones para descargue: Pendientes (1) y En Proceso (2)
  const { GetAssignments, StartTask, FinishTask, AssignPositions } =
    useWarehouseAssignment({
    payloadAssignments:
      companyId && moduleCode
        ? {
            company_id: companyId,
            module_code: moduleCode,
            page_number: pageNumber,
            page_size: PAGE_SIZE,
            status:
              statusFilter === "all" ? undefined : Number(statusFilter),
          }
        : null,
    });

  const { data: assignmentsData, isLoading, isFetching, error } = GetAssignments;

  if (error) {
    handleRequestError(error);
  }

  const rawAssignments = assignmentsData?.data ?? [];

  // Filtro de búsqueda local por mercancía, descripción y validación de estado Pendiente / En Proceso
  const filteredAssignments = useMemo(() => {
    return rawAssignments.filter((item) => {
      const isAllowedStatus =
        statusFilter === "all"
          ? item.status === AssignmentOperationalStatus.Pending ||
            item.status === AssignmentOperationalStatus.InProgress ||
            (item.status as unknown) === "Pending" ||
            (item.status as unknown) === "InProgress"
          : true;

      if (!isAllowedStatus) return false;

      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const matchMerchandise = item.merchandise?.toLowerCase().includes(term);
      const matchDesc = item.merchandise_description?.toLowerCase().includes(term);
      return matchMerchandise || matchDesc;
    });
  }, [rawAssignments, searchTerm, statusFilter]);

  const handleApplyFilter = useCallback((term: string, status: string) => {
    setSearchTerm(term);
    setStatusFilter(status);
    setPageNumber(1);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setPageNumber(1);
  }, []);

  // Abrir confirmación de inicio de descarga
  const handleOpenStartModal = useCallback(
    (assignment: AssignmentOperationalDto) => {
      setSelectedAssignmentForStart(assignment);
    },
    [],
  );

  // Abrir modal de finalización de descarga
  const handleOpenFinishModal = useCallback(
    (assignment: AssignmentOperationalDto) => {
      setSelectedAssignmentForFinish(assignment);
    },
    [],
  );

  // Redireccionar al 3D con la asignación activa
  const handleGoTo3D = useCallback(
    (assignment: AssignmentOperationalDto) => {
      if (assignment.warehouse_id) {
        setBodega(assignment.warehouse_id, assignment.warehouse_name || "Bodega");
      }
      setActiveDescargueAssignment({
        assignmentId: assignment.assignment_id,
        operationalOrderId: assignment.operational_order_id,
        merchandise: assignment.merchandise,
        merchandiseDescription: assignment.merchandise_description,
        warehouseId: assignment.warehouse_id || "",
        status: assignment.status,
      });
      navigate(`${baseUrl}/warehouse-mga/bodegas`);
    },
    [baseUrl, navigate, setActiveDescargueAssignment, setBodega],
  );

  // Confirmar inicio de tarea y redirección inmediata a Bodega 3D
  const handleConfirmStartDescargue = useCallback(
    async (
      assignment: AssignmentOperationalDto,
      warehouseId: string,
      warehouseName: string,
    ) => {
      if (!companyId || !moduleCode) return;

      try {
        setIsStartingTask(true);

        // 1. Ejecutar POST .../start-task para pasar de Pending -> InProgress
        await StartTask.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          operational_order_id: assignment.operational_order_id,
          assignment_id: assignment.assignment_id,
        });

        // 2. Configurar la bodega seleccionada en el visor 3D
        setBodega(warehouseId, warehouseName);

        // 3. Establecer la asignación activa en el store
        setActiveDescargueAssignment({
          assignmentId: assignment.assignment_id,
          operationalOrderId: assignment.operational_order_id,
          merchandise: assignment.merchandise,
          merchandiseDescription: assignment.merchandise_description,
          warehouseId,
          status: AssignmentOperationalStatus.InProgress,
        });

        // 4. Cerrar el modal
        setSelectedAssignmentForStart(null);

        handleRequestSuccess(
          `¡Descarga iniciada para "${assignment.merchandise || "la mercancía"}"! Selecciona las posiciones en la bodega 3D.`,
        );

        // 5. Redireccionar a la ruta correcta de Bodegas 3D
        navigate(`${baseUrl}/warehouse-mga/bodegas`);
      } catch (err) {
        handleRequestError(err);
      } finally {
        setIsStartingTask(false);
      }
    },
    [
      baseUrl,
      companyId,
      moduleCode,
      navigate,
      setActiveDescargueAssignment,
      setBodega,
      StartTask,
      handleRequestSuccess,
      handleRequestError,
    ],
  );

  const handleStartFromAssignmentDetail = useCallback(
    (detail: AssignmentOperationalDetailsDto) => {
      const warehouseId =
        detail.warehouse_information?.warehouse_id ||
        detail.warehouse_id ||
        "";
      const warehouseName =
        detail.warehouse_information?.code ||
        detail.warehouse_code ||
        detail.warehouse_name ||
        "Bodega";

      void handleConfirmStartDescargue(detail, warehouseId, warehouseName);
    },
    [handleConfirmStartDescargue],
  );

  // Confirmar finalización de la descarga
  const handleConfirmFinishDescargue = useCallback(
    async (
      assignment: AssignmentOperationalDto,
      positioning: PositioningInformation,
    ) => {
      if (!companyId || !moduleCode) return;

      try {
        setIsFinishingTask(true);

        const count = Number(positioning.palletCount);
        const bulks = Number(positioning.bulksPerPallet);
        const width = Number(positioning.palletWidth);
        const length = Number(positioning.palletLength);

        if (!Number.isInteger(count) || count <= 0) {
          handleRequestError("La cantidad de polines debe ser mayor que cero.");
          return;
        }
        if (
          positioning.merchandiseType === 1 &&
          (!Number.isInteger(bulks) || bulks <= 0)
        ) {
          handleRequestError("Los bultos por polín deben ser mayores que cero.");
          return;
        }
        if (positioning.palletType === 2 && (width <= 0 || length <= 0)) {
          handleRequestError(
            "Las dimensiones del polín sobredimensionado deben ser mayores que cero.",
          );
          return;
        }

        // El backend exige registrar los polines antes de permitir finalizar.
        await AssignPositions.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          operational_order_id: assignment.operational_order_id,
          assignment_id: assignment.assignment_id,
          merchandise_type: positioning.merchandiseType,
          pallets: [
            {
              type: positioning.palletType,
              count_pallets: count,
              width: positioning.palletType === 2 ? width : undefined,
              length: positioning.palletType === 2 ? length : undefined,
              bulks_per_pallet:
                positioning.merchandiseType === 1 ? bulks : null,
            },
          ],
        });

        // Ejecutar POST .../finish-task para pasar de InProgress -> Downloaded
        await FinishTask.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          operational_order_id: assignment.operational_order_id,
          assignment_id: assignment.assignment_id,
        });

        setSelectedAssignmentForFinish(null);

        handleRequestSuccess(
          `¡Descarga finalizada para "${assignment.merchandise || "la mercancía"}"! Las posiciones asignadas han quedado ocupadas.`,
        );

        GetAssignments.refetch();
      } catch (err) {
        handleRequestError(err);
      } finally {
        setIsFinishingTask(false);
      }
    },
    [
      companyId,
      moduleCode,
      FinishTask,
      AssignPositions,
      handleRequestSuccess,
      handleRequestError,
      GetAssignments,
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
      {isLoading && <Loader title="Cargando asignaciones para descargue..." />}

      <DescargueHeader />

      <DescargueFilters
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
      />

      <DescargueTable
        data={filteredAssignments}
        currentPage={assignmentsData?.page_number ?? pageNumber}
        totalRecords={assignmentsData?.total ?? filteredAssignments.length}
        pageSize={assignmentsData?.page_size ?? PAGE_SIZE}
        isFetching={isFetching}
        onPageChange={setPageNumber}
        onStartDescargue={handleOpenStartModal}
        onFinishDescargue={handleOpenFinishModal}
        onGoTo3D={handleGoTo3D}
      />

      {/* Modal unificado con el detalle completo de asignación y PO */}
      <AssignmentDetailModal
        isOpen={Boolean(selectedAssignmentForStart)}
        onClose={() => setSelectedAssignmentForStart(null)}
        operationalOrderId={
          selectedAssignmentForStart?.operational_order_id ?? null
        }
        assignmentId={selectedAssignmentForStart?.assignment_id ?? null}
        primaryActionLabel="Iniciar Descarga y Asignar en 3D"
        onPrimaryAction={handleStartFromAssignmentDetail}
        isPrimaryActionLoading={isStartingTask}
      />

      {/* Modal para Confirmar Finalizar Descarga */}
      <FinishDescargueModal
        isOpen={Boolean(selectedAssignmentForFinish)}
        onClose={() => setSelectedAssignmentForFinish(null)}
        assignment={selectedAssignmentForFinish}
        isSubmitting={isFinishingTask}
        onConfirm={handleConfirmFinishDescargue}
      />

      {AlertComponent}
    </m.div>
  );
}

export default DescarguePage;
